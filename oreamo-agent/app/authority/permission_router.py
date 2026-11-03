from typing import Annotated

from fastapi import APIRouter, Query

from app.authority import permission_service
from app.authority.permission_schema import (
    Permission,
    PermissionCode,
    PermissionDelete,
    PermissionInfo,
    PermissionOperation,
    PermissionSave,
    PermissionSearch,
    PermissionsSearch,
    PermissionUpdate,
)
from app.common.schema import PageResponse, RestResponse
from app.core.database import DbSession
from app.session.session_dependencies import CurrentUser, authorize

router = APIRouter(prefix="/permissions", tags=["Permission"])


@router.get(
    "",
    summary="Get Permissions",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_READ)],
)
async def get_permissions(
    permissions_search: Annotated[PermissionsSearch, Query()], db: DbSession
) -> RestResponse[PageResponse[Permission]]:
    permissions = await permission_service.get_permissions(
        permissions_search=permissions_search, db=db
    )
    return RestResponse.of_success(permissions)


@router.get("/infos", summary="Get Permission Infos")
async def get_permission_infos(db: DbSession) -> RestResponse[list[PermissionInfo]]:
    permissions = await permission_service.get_permissions(
        permissions_search=PermissionsSearch.of_enabled(), db=db
    )
    permission_infos = [
        permission.to_permission_info() for permission in permissions.items
    ]
    return RestResponse.of_success(permission_infos)


@router.get(
    "/{permission_code}",
    summary="Get Permission",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_READ)],
)
async def get_permission(
    permission_code: str, db: DbSession
) -> RestResponse[Permission]:
    permission = await permission_service.get_permission(
        permission_search=PermissionSearch.of_permission_code(permission_code), db=db
    )
    return RestResponse.of_success(permission)


@router.post(
    "",
    summary="Post Permission",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_WRITE)],
)
async def post_permission(
    permission_save: PermissionSave, current_user: CurrentUser, db: DbSession
) -> RestResponse[Permission]:
    permission = await permission_service.save_permission(
        permission_save=permission_save, author=current_user.username, db=db
    )
    return RestResponse.of_success(permission)


@router.put(
    "/{permission_code}",
    summary="Put Permission",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_WRITE)],
)
async def put_permission(
    permission_code: str,
    permission_update: PermissionUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[None]:
    await permission_service.update_permission(
        permission_update=permission_update, author=current_user.username, db=db
    )
    return RestResponse.of_success(None)


@router.delete(
    "/{permission_code}",
    summary="Delete Permission",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_WRITE)],
)
async def delete_permission(
    permission_code: str,
    permission_delete: PermissionDelete,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[bool]:
    await permission_service.delete_permission(
        permission_delete=permission_delete, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)


@router.post(
    "/operation",
    summary="Operate Permissions",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_WRITE)],
)
async def operate_permissions(
    permission_operation: PermissionOperation, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await permission_service.operate_permissions(
        permission_operation=permission_operation, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)
