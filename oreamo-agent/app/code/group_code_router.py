from typing import Annotated

from fastapi import APIRouter, Query

from app.authority.permission_schema import PermissionCode
from app.code import group_code_service
from app.code.group_code_schema import (
    GroupCode,
    GroupCodeDelete,
    GroupCodeOperation,
    GroupCodeSave,
    GroupCodeSearch,
    GroupCodesSearch,
    GroupCodeUpdate,
)
from app.common.schema import PageResponse, RestResponse
from app.core.database import DbSession
from app.session.session_dependencies import CurrentUser, authorize

router = APIRouter(prefix="/group-codes", tags=["Group Code"])


@router.get(
    "",
    summary="Get Group Codes",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_READ)],
)
async def get_group_codes(
    group_codes_search: Annotated[GroupCodesSearch, Query()], db: DbSession
) -> RestResponse[PageResponse[GroupCode]]:
    group_codes = await group_code_service.get_group_codes(
        group_codes_search=group_codes_search, db=db
    )
    return RestResponse.of_success(group_codes)


@router.get(
    "/{group_code}",
    summary="Get Group Code",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_READ)],
)
async def get_group_code(
    group_code: str,
    db: DbSession,
    data_status: Annotated[str | None, Query(alias="dataStatus")] = None,
) -> RestResponse[GroupCode]:
    found_group_code = await group_code_service.get_group_code(
        group_code_search=GroupCodeSearch.of_group_code(group_code, data_status), db=db
    )
    return RestResponse.of_success(found_group_code)


@router.post(
    "",
    summary="Post Group Code",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_WRITE)],
)
async def post_group_code(
    group_code_save: GroupCodeSave, current_user: CurrentUser, db: DbSession
) -> RestResponse[GroupCode]:
    group_code = await group_code_service.save_group_code(
        group_code_save=group_code_save, author=current_user.username, db=db
    )
    return RestResponse.of_success(group_code)


@router.put(
    "/{group_code}",
    summary="Put Group Code",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_WRITE)],
)
async def put_group_code(
    group_code: str,
    group_code_update: GroupCodeUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[GroupCode]:
    updated_group_code = await group_code_service.update_group_code(
        group_code_update=group_code_update, author=current_user.username, db=db
    )
    return RestResponse.of_success(updated_group_code)


@router.delete(
    "/{group_code}",
    summary="Delete Group Code",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_WRITE)],
)
async def delete_group_code(
    group_code: str,
    group_code_delete: GroupCodeDelete,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[bool]:
    await group_code_service.delete_group_code(
        group_code_delete=group_code_delete, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)


@router.post(
    "/operation",
    summary="Operate Group Codes",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_WRITE)],
)
async def operate_group_codes(
    group_code_operation: GroupCodeOperation, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await group_code_service.operate_group_codes(
        group_code_operation=group_code_operation, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)
