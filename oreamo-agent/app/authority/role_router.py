from typing import Annotated

from fastapi import APIRouter, Query

from app.authority import role_service
from app.authority.permission_schema import PermissionCode
from app.authority.role_schema import (
    Role,
    RoleDelete,
    RoleInfo,
    RoleOperation,
    RoleSave,
    RoleSearch,
    RolesSearch,
    RoleUpdate,
)
from app.common.schema import PageResponse, RestResponse
from app.core.database import DbSession
from app.session.session_dependencies import CurrentUser, authorize

router = APIRouter(prefix="/roles", tags=["Role"])


@router.get(
    "",
    summary="Get Roles",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_READ)],
)
async def get_roles(
    roles_search: Annotated[RolesSearch, Query()], db: DbSession
) -> RestResponse[PageResponse[Role]]:
    roles = await role_service.get_roles(roles_search=roles_search, db=db)
    return RestResponse.of_success(roles)


@router.get("/infos", summary="Get Role Infos")
async def get_role_infos(db: DbSession) -> RestResponse[list[RoleInfo]]:
    roles = await role_service.get_roles(roles_search=RolesSearch.of_enabled(), db=db)
    role_infos = [role.to_role_info() for role in roles.items]
    return RestResponse.of_success(role_infos)


@router.get(
    "/{role_code}",
    summary="Get Role",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_READ)],
)
async def get_role(role_code: str, db: DbSession) -> RestResponse[Role]:
    role = await role_service.get_role(
        role_search=RoleSearch.of_role_code(role_code), db=db
    )
    return RestResponse.of_success(role)


@router.post(
    "",
    summary="Post Role",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_WRITE)],
)
async def post_role(
    role_save: RoleSave, current_user: CurrentUser, db: DbSession
) -> RestResponse[Role]:
    role = await role_service.save_role(
        role_save=role_save, author=current_user.username, db=db
    )
    return RestResponse.of_success(role)


@router.put(
    "/{role_code}",
    summary="Put Role",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_WRITE)],
)
async def put_role(
    role_code: str, role_update: RoleUpdate, current_user: CurrentUser, db: DbSession
) -> RestResponse[None]:
    await role_service.update_role(
        role_update=role_update, author=current_user.username, db=db
    )
    return RestResponse.of_success(None)


@router.delete(
    "/{role_code}",
    summary="Delete Role",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_WRITE)],
)
async def delete_role(
    role_code: str, role_delete: RoleDelete, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await role_service.delete_role(
        role_delete=role_delete, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)


@router.post(
    "/operation",
    summary="Operate Roles",
    dependencies=[authorize(PermissionCode.AUTHORITY_MANAGEMENT_WRITE)],
)
async def operate_roles(
    role_operation: RoleOperation, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await role_service.operate_roles(
        role_operation=role_operation, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)
