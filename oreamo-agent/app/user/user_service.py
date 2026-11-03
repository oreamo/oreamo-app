from sqlalchemy import delete, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.exception import RestException
from app.common.pagination import paginate
from app.common.schema import PageResponse
from app.common.translation_key import TranslationKey
from app.core.config import settings
from app.core.security import hash_password
from app.file import file_service
from app.file.file_schema import FilesSearch
from app.user.user_model import UserEntity
from app.user.user_schema import (
    User,
    UserDelete,
    UserOperation,
    UserPasswordReset,
    UserProfileImage,
    UserProfileImageUpdate,
    UserSave,
    UserSearch,
    UsersSearch,
    UserUpdate,
)

PROFILE_IMAGE_MAX_SIZE = 5 * 1024 * 1024
PROFILE_IMAGE_MAX_SIZE_LABEL = "5MB"


async def get_user(*, user_search: UserSearch, db: AsyncSession) -> User:
    user = await find_user(user_search=user_search, db=db)
    if user is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.User.Label.USER,
        )
    return user


async def find_user(*, user_search: UserSearch, db: AsyncSession) -> User | None:
    query = select(UserEntity)
    if user_search.username:
        query = query.where(UserEntity.username == user_search.username)

    entity = (await db.execute(query)).scalar_one_or_none()
    return User.model_validate(entity) if entity is not None else None


async def get_users(
    *, users_search: UsersSearch, db: AsyncSession
) -> PageResponse[User]:
    query = select(UserEntity)
    if users_search.username:
        query = query.where(UserEntity.username == users_search.username)
    if users_search.role_code:
        query = query.where(UserEntity.role_code == users_search.role_code)
    if users_search.data_status:
        query = query.where(UserEntity.data_status == users_search.data_status)
    query = query.order_by(UserEntity.username)

    users = await paginate(query=query, pagination=users_search, schema=User, db=db)
    # The user list does not expose credentials or profile images
    for user in users.items:
        user.password = None
        user.profile_image_file_group_id = None
    return users


async def save_user(*, user_save: UserSave, author: str, db: AsyncSession) -> User:
    user_search = UserSearch.of_username(user_save.username)
    if await find_user(user_search=user_search, db=db) is not None:
        raise RestException(
            TranslationKey.Common.Message.DUPLICATE_FAILURE,
            TranslationKey.User.Label.USERNAME,
            user_save.username,
        )

    raw_password = user_save.password
    if not raw_password or not raw_password.strip():
        raw_password = settings.initial_password
    result = await db.execute(
        insert(UserEntity).values(
            username=user_save.username,
            password=await hash_password(raw_password),
            role_code=user_save.role_code,
            data_status=user_save.data_status,
            created_by=author,
            updated_by=author,
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)

    user = await find_user(user_search=user_search, db=db)
    if user is None:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)
    return user


async def update_user(
    *, user_update: UserUpdate, author: str, db: AsyncSession
) -> None:
    await get_user(user_search=UserSearch.of_username(user_update.username), db=db)

    updated_count = await _update_user(
        username=user_update.username,
        role_code=user_update.role_code,
        data_status=user_update.data_status,
        author=author,
        db=db,
    )
    if updated_count == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)


async def get_user_profile_image(
    *, user_search: UserSearch, db: AsyncSession
) -> UserProfileImage:
    user = await get_user(user_search=user_search, db=db)
    if not user.has_profile_image() or user.profile_image_file_group_id is None:
        return UserProfileImage.of_empty()

    profile_image_file_group_id = user.profile_image_file_group_id
    file_group = await file_service.get_file_group(
        files_search=FilesSearch.of_file_group_id(profile_image_file_group_id), db=db
    )
    latest_file = file_group.find_latest_file()
    if latest_file is None:
        return UserProfileImage.of_file_group_id(profile_image_file_group_id)
    return UserProfileImage.of_file_info(profile_image_file_group_id, latest_file)


async def update_user_profile_image(
    *,
    username: str,
    user_profile_image_update: UserProfileImageUpdate,
    author: str,
    db: AsyncSession,
) -> None:
    await get_user(user_search=UserSearch.of_username(username), db=db)

    file_group = await file_service.get_file_group(
        files_search=FilesSearch.of_file_group_id(
            user_profile_image_update.file_group_id
        ),
        db=db,
    )
    profile_image = file_group.find_latest_file()
    if profile_image is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.File.Label.FILES,
        )
    if not profile_image.is_image():
        raise RestException(
            TranslationKey.User.Message.PROFILE_IMAGE_TYPE_VALIDATION_FAILURE
        )
    if profile_image.is_larger_than(PROFILE_IMAGE_MAX_SIZE):
        raise RestException(
            TranslationKey.Common.Message.MAX_SIZE_VALIDATION_FAILURE,
            TranslationKey.User.Label.PROFILE_IMAGE,
            PROFILE_IMAGE_MAX_SIZE_LABEL,
        )

    updated_count = await _update_user_profile_image(
        username=username,
        profile_image_file_group_id=user_profile_image_update.file_group_id,
        author=author,
        db=db,
    )
    if updated_count == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)


async def delete_user_profile_image(
    *, username: str, author: str, db: AsyncSession
) -> None:
    await get_user(user_search=UserSearch.of_username(username), db=db)

    updated_count = await _update_user_profile_image(
        username=username, profile_image_file_group_id=None, author=author, db=db
    )
    if updated_count == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)


async def reset_user_password(
    *, user_password_reset: UserPasswordReset, author: str, db: AsyncSession
) -> None:
    await get_user(
        user_search=UserSearch.of_username(user_password_reset.username), db=db
    )

    updated_count = await _update_user(
        username=user_password_reset.username,
        password=await hash_password(settings.initial_password),
        author=author,
        db=db,
    )
    if updated_count == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)


async def delete_user(
    *, user_delete: UserDelete, author: str, db: AsyncSession
) -> None:
    await get_user(user_search=UserSearch.of_username(user_delete.username), db=db)

    result = await db.execute(
        delete(UserEntity).where(UserEntity.username == user_delete.username)
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.DELETE_FAILURE)


async def operate_users(
    *, user_operation: UserOperation, author: str, db: AsyncSession
) -> None:
    for user_delete in user_operation.user_deletes or []:
        await delete_user(user_delete=user_delete, author=author, db=db)

    for user_update in user_operation.user_updates or []:
        await update_user(user_update=user_update, author=author, db=db)

    for user_save in user_operation.user_saves or []:
        await save_user(user_save=user_save, author=author, db=db)


async def _update_user(
    *,
    username: str,
    role_code: str | None = None,
    data_status: str | None = None,
    password: str | None = None,
    author: str,
    db: AsyncSession,
) -> int:
    # Only non-empty values are updated
    values: dict[str, object] = {"updated_by": author, "updated_at": func.now()}
    if data_status:
        values["data_status"] = data_status
    if password:
        values["password"] = password
    if role_code:
        values["role_code"] = role_code

    result = await db.execute(
        update(UserEntity).where(UserEntity.username == username).values(**values)
    )
    return result.rowcount


async def _update_user_profile_image(
    *,
    username: str,
    profile_image_file_group_id: str | None,
    author: str,
    db: AsyncSession,
) -> int:
    result = await db.execute(
        update(UserEntity)
        .where(UserEntity.username == username)
        .values(
            profile_image_file_group_id=profile_image_file_group_id,
            updated_by=author,
            updated_at=func.now(),
        )
    )
    return result.rowcount
