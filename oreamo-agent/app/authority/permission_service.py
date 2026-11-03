from sqlalchemy import delete, exists, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.authority.permission_model import PermissionEntity
from app.authority.permission_schema import (
    Permission,
    PermissionDelete,
    PermissionOperation,
    PermissionSave,
    PermissionSearch,
    PermissionsSearch,
    PermissionUpdate,
)
from app.authority.role_model import RolePermissionEntity
from app.common.exception import RestException
from app.common.pagination import paginate
from app.common.schema import PageResponse
from app.common.translation_key import TranslationKey


async def get_permissions(
    *, permissions_search: PermissionsSearch, db: AsyncSession
) -> PageResponse[Permission]:
    query = select(PermissionEntity)
    if permissions_search.role_code:
        query = query.where(
            exists().where(
                RolePermissionEntity.permission_code
                == PermissionEntity.permission_code,
                RolePermissionEntity.role_code == permissions_search.role_code,
            )
        )
    if permissions_search.data_status:
        query = query.where(
            PermissionEntity.data_status == permissions_search.data_status
        )
    query = query.order_by(PermissionEntity.sort_order)

    return await paginate(
        query=query, pagination=permissions_search, schema=Permission, db=db
    )


async def get_permission(
    *, permission_search: PermissionSearch, db: AsyncSession
) -> Permission:
    permission = await _select_permission(permission_search=permission_search, db=db)
    if permission is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.Authority.Label.PERMISSION,
        )
    return permission


async def save_permission(
    *, permission_save: PermissionSave, author: str, db: AsyncSession
) -> Permission:
    permission_search = PermissionSearch.of_permission_code(
        permission_save.permission_code
    )
    if await _select_permission(permission_search=permission_search, db=db) is not None:
        raise RestException(
            TranslationKey.Common.Message.DUPLICATE_FAILURE,
            TranslationKey.Authority.Label.PERMISSION_CODE,
            permission_save.permission_code,
        )

    result = await db.execute(
        insert(PermissionEntity).values(
            permission_code=permission_save.permission_code,
            permission_name=permission_save.permission_name,
            data_status=permission_save.data_status,
            sort_order=permission_save.sort_order,
            created_by=author,
            updated_by=author,
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)

    permission = await _select_permission(permission_search=permission_search, db=db)
    if permission is None:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)
    return permission


async def update_permission(
    *, permission_update: PermissionUpdate, author: str, db: AsyncSession
) -> None:
    permission_search = PermissionSearch.of_permission_code(
        permission_update.permission_code
    )
    await get_permission(permission_search=permission_search, db=db)

    result = await db.execute(
        update(PermissionEntity)
        .where(PermissionEntity.permission_code == permission_update.permission_code)
        .values(
            permission_name=permission_update.permission_name,
            data_status=permission_update.data_status,
            sort_order=permission_update.sort_order,
            updated_by=author,
            updated_at=func.now(),
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)


async def delete_permission(
    *, permission_delete: PermissionDelete, author: str, db: AsyncSession
) -> None:
    permission_search = PermissionSearch.of_permission_code(
        permission_delete.permission_code
    )
    await get_permission(permission_search=permission_search, db=db)

    await db.execute(
        delete(RolePermissionEntity).where(
            RolePermissionEntity.permission_code == permission_delete.permission_code
        )
    )

    result = await db.execute(
        delete(PermissionEntity).where(
            PermissionEntity.permission_code == permission_delete.permission_code
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.DELETE_FAILURE)


async def operate_permissions(
    *, permission_operation: PermissionOperation, author: str, db: AsyncSession
) -> None:
    for permission_delete in permission_operation.permission_deletes or []:
        await delete_permission(
            permission_delete=permission_delete, author=author, db=db
        )

    for permission_update in permission_operation.permission_updates or []:
        await update_permission(
            permission_update=permission_update, author=author, db=db
        )

    for permission_save in permission_operation.permission_saves or []:
        await save_permission(permission_save=permission_save, author=author, db=db)


async def _select_permission(
    *, permission_search: PermissionSearch, db: AsyncSession
) -> Permission | None:
    query = select(PermissionEntity)
    if permission_search.permission_code:
        query = query.where(
            PermissionEntity.permission_code == permission_search.permission_code
        )

    entity = (await db.execute(query)).scalar_one_or_none()
    return Permission.model_validate(entity) if entity is not None else None
