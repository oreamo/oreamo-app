from typing import Annotated

from fastapi import APIRouter, Query

from app.authority.permission_schema import PermissionCode
from app.common.schema import PageResponse, RestResponse
from app.core.database import DbSession
from app.session.session_dependencies import CurrentUser, authorize
from app.user import user_service
from app.user.user_schema import (
    User,
    UserDelete,
    UserOperation,
    UserPasswordReset,
    UserSave,
    UserSearch,
    UsersSearch,
    UserUpdate,
)

router = APIRouter(prefix="/users", tags=["User"])


@router.get(
    "",
    summary="Get Users",
    dependencies=[authorize(PermissionCode.USER_MANAGEMENT_READ)],
)
async def get_users(
    users_search: Annotated[UsersSearch, Query()], db: DbSession
) -> RestResponse[PageResponse[User]]:
    users = await user_service.get_users(users_search=users_search, db=db)
    return RestResponse.of_success(users)


@router.get(
    "/{username}",
    summary="Get User",
    dependencies=[authorize(PermissionCode.USER_MANAGEMENT_READ)],
)
async def get_user(username: str, db: DbSession) -> RestResponse[User]:
    user = await user_service.get_user(
        user_search=UserSearch.of_username(username), db=db
    )
    return RestResponse.of_success(user)


@router.post(
    "",
    summary="Post User",
    dependencies=[authorize(PermissionCode.USER_MANAGEMENT_WRITE)],
)
async def post_user(
    user_save: UserSave, current_user: CurrentUser, db: DbSession
) -> RestResponse[User]:
    user = await user_service.save_user(
        user_save=user_save, author=current_user.username, db=db
    )
    return RestResponse.of_success(user)


@router.put(
    "/{username}",
    summary="Put User",
    dependencies=[authorize(PermissionCode.USER_MANAGEMENT_WRITE)],
)
async def put_user(
    username: str, user_update: UserUpdate, current_user: CurrentUser, db: DbSession
) -> RestResponse[None]:
    await user_service.update_user(
        user_update=user_update, author=current_user.username, db=db
    )
    return RestResponse.of_success(None)


@router.post(
    "/password/reset",
    summary="Reset User Password",
    dependencies=[authorize(PermissionCode.USER_MANAGEMENT_WRITE)],
)
async def reset_user_password(
    user_password_reset: UserPasswordReset, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await user_service.reset_user_password(
        user_password_reset=user_password_reset, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)


@router.delete(
    "/{username}",
    summary="Delete User",
    dependencies=[authorize(PermissionCode.USER_MANAGEMENT_WRITE)],
)
async def delete_user(
    username: str, user_delete: UserDelete, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await user_service.delete_user(
        user_delete=user_delete, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)


@router.post(
    "/operation",
    summary="Operate Users",
    dependencies=[authorize(PermissionCode.USER_MANAGEMENT_WRITE)],
)
async def operate_users(
    user_operation: UserOperation, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await user_service.operate_users(
        user_operation=user_operation, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)
