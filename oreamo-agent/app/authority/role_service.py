from sqlalchemy import delete, exists, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.authority.role_model import RoleEntity, RolePermissionEntity
from app.authority.role_schema import (
    Role,
    RoleDelete,
    RoleOperation,
    RoleSave,
    RoleSearch,
    RolesSearch,
    RoleUpdate,
)
from app.common.exception import RestException
from app.common.pagination import paginate
from app.common.schema import PageResponse
from app.common.translation_key import TranslationKey
from app.user import user_service
from app.user.user_schema import UsersSearch


async def get_roles(
    *, roles_search: RolesSearch, db: AsyncSession
) -> PageResponse[Role]:
    query = select(RoleEntity)
    if roles_search.role_name:
        query = query.where(RoleEntity.role_name.contains(roles_search.role_name))
    if roles_search.permission_codes:
        query = query.where(
            exists().where(
                RolePermissionEntity.role_code == RoleEntity.role_code,
                RolePermissionEntity.permission_code.in_(roles_search.permission_codes),
            )
        )
    if roles_search.data_status:
        query = query.where(RoleEntity.data_status == roles_search.data_status)
    query = query.order_by(RoleEntity.sort_order)

    return await paginate(query=query, pagination=roles_search, schema=Role, db=db)


async def get_role(*, role_search: RoleSearch, db: AsyncSession) -> Role:
    role = await _select_role(role_search=role_search, db=db)
    if role is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.Authority.Label.ROLE,
        )
    return role


async def save_role(*, role_save: RoleSave, author: str, db: AsyncSession) -> Role:
    role_search = RoleSearch.of_role_code(role_save.role_code)
    if await _select_role(role_search=role_search, db=db) is not None:
        raise RestException(
            TranslationKey.Common.Message.DUPLICATE_FAILURE,
            TranslationKey.Authority.Label.ROLE_CODE,
            role_save.role_code,
        )

    result = await db.execute(
        insert(RoleEntity).values(
            role_code=role_save.role_code,
            role_name=role_save.role_name,
            data_status=role_save.data_status,
            sort_order=role_save.sort_order,
            created_by=author,
            updated_by=author,
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)

    if role_save.permission_codes:
        await _insert_role_permissions(
            role_code=role_save.role_code,
            permission_codes=role_save.permission_codes,
            db=db,
        )

    role = await _select_role(role_search=role_search, db=db)
    if role is None:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)
    return role


async def update_role(
    *, role_update: RoleUpdate, author: str, db: AsyncSession
) -> None:
    role_search = RoleSearch.of_role_code(role_update.role_code)
    await get_role(role_search=role_search, db=db)

    result = await db.execute(
        update(RoleEntity)
        .where(RoleEntity.role_code == role_update.role_code)
        .values(
            role_name=role_update.role_name,
            data_status=role_update.data_status,
            sort_order=role_update.sort_order,
            updated_by=author,
            updated_at=func.now(),
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)

    if role_update.is_permission_codes_replaced():
        await _delete_role_permissions(role_code=role_update.role_code, db=db)

        if role_update.permission_codes:
            await _insert_role_permissions(
                role_code=role_update.role_code,
                permission_codes=role_update.permission_codes,
                db=db,
            )


async def delete_role(
    *, role_delete: RoleDelete, author: str, db: AsyncSession
) -> None:
    role_search = RoleSearch.of_role_code(role_delete.role_code)
    role = await get_role(role_search=role_search, db=db)

    role_users = await user_service.get_users(
        users_search=UsersSearch.of_role_code(role_delete.role_code), db=db
    )
    if role_users.items:
        raise RestException(
            TranslationKey.Authority.Message.ROLE_DELETE_FAILURE_BY_USER
        )

    if role.has_permission_codes():
        await _delete_role_permissions(role_code=role_delete.role_code, db=db)

    result = await db.execute(
        delete(RoleEntity).where(RoleEntity.role_code == role_delete.role_code)
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.DELETE_FAILURE)


async def operate_roles(
    *, role_operation: RoleOperation, author: str, db: AsyncSession
) -> None:
    for role_delete in role_operation.role_deletes or []:
        await delete_role(role_delete=role_delete, author=author, db=db)

    for role_update in role_operation.role_updates or []:
        await update_role(role_update=role_update, author=author, db=db)

    for role_save in role_operation.role_saves or []:
        await save_role(role_save=role_save, author=author, db=db)


async def _select_role(*, role_search: RoleSearch, db: AsyncSession) -> Role | None:
    query = select(RoleEntity)
    if role_search.role_code:
        query = query.where(RoleEntity.role_code == role_search.role_code)

    entity = (await db.execute(query)).scalar_one_or_none()
    if entity is None:
        return None

    permission_codes = await db.scalars(
        select(RolePermissionEntity.permission_code)
        .where(RolePermissionEntity.role_code == entity.role_code)
        .order_by(RolePermissionEntity.permission_code)
    )
    role = Role.model_validate(entity)
    role.permission_codes = list(permission_codes)
    return role


async def _insert_role_permissions(
    *, role_code: str, permission_codes: list[str], db: AsyncSession
) -> None:
    await db.execute(
        insert(RolePermissionEntity).values(
            [
                {"role_code": role_code, "permission_code": permission_code}
                for permission_code in permission_codes
            ]
        )
    )


async def _delete_role_permissions(*, role_code: str, db: AsyncSession) -> None:
    await db.execute(
        delete(RolePermissionEntity).where(RolePermissionEntity.role_code == role_code)
    )
