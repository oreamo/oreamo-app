from typing import Annotated

from fastapi import APIRouter, Query

from app.authority.permission_schema import PermissionCode
from app.code import common_code_service
from app.code.common_code_schema import (
    CommonCode,
    CommonCodeDelete,
    CommonCodeInfo,
    CommonCodeOperation,
    CommonCodeSave,
    CommonCodeSearch,
    CommonCodesSearch,
    CommonCodeUpdate,
)
from app.common.schema import PageResponse, RestResponse
from app.core.database import DbSession
from app.session.session_dependencies import CurrentUser, authorize

router = APIRouter(prefix="/common-codes", tags=["Common Code"])


@router.get(
    "",
    summary="Get Common Codes",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_READ)],
)
async def get_common_codes(
    common_codes_search: Annotated[CommonCodesSearch, Query()], db: DbSession
) -> RestResponse[PageResponse[CommonCode]]:
    common_codes = await common_code_service.get_common_codes(
        common_codes_search=common_codes_search, db=db
    )
    return RestResponse.of_success(common_codes)


@router.get("/infos", summary="Get Common Code Infos")
async def get_common_code_infos(
    group_codes: Annotated[list[str], Query(alias="groupCodes")], db: DbSession
) -> RestResponse[list[CommonCodeInfo]]:
    common_codes = await common_code_service.get_common_codes(
        common_codes_search=CommonCodesSearch.of_enabled_group_codes(group_codes), db=db
    )
    common_code_infos = [
        common_code.to_common_code_info() for common_code in common_codes.items
    ]
    return RestResponse.of_success(common_code_infos)


@router.get(
    "/{common_code}",
    summary="Get Common Code",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_READ)],
)
async def get_common_code(
    common_code: str,
    common_code_search: Annotated[CommonCodeSearch, Query()],
    db: DbSession,
) -> RestResponse[CommonCode]:
    found_common_code = await common_code_service.get_common_code(
        common_code_search=common_code_search.model_copy(
            update={"common_code": common_code}
        ),
        db=db,
    )
    return RestResponse.of_success(found_common_code)


@router.post(
    "",
    summary="Post Common Code",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_WRITE)],
)
async def post_common_code(
    common_code_save: CommonCodeSave, current_user: CurrentUser, db: DbSession
) -> RestResponse[CommonCode]:
    common_code = await common_code_service.save_common_code(
        common_code_save=common_code_save, author=current_user.username, db=db
    )
    return RestResponse.of_success(common_code)


@router.put(
    "/{common_code}",
    summary="Put Common Code",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_WRITE)],
)
async def put_common_code(
    common_code: str,
    common_code_update: CommonCodeUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[CommonCode]:
    updated_common_code = await common_code_service.update_common_code(
        common_code_update=common_code_update, author=current_user.username, db=db
    )
    return RestResponse.of_success(updated_common_code)


@router.delete(
    "/{common_code}",
    summary="Delete Common Code",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_WRITE)],
)
async def delete_common_code(
    common_code: str,
    common_code_delete: CommonCodeDelete,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[bool]:
    await common_code_service.delete_common_code(
        common_code_delete=common_code_delete, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)


@router.post(
    "/operation",
    summary="Operate Common Codes",
    dependencies=[authorize(PermissionCode.CODE_MANAGEMENT_WRITE)],
)
async def operate_common_codes(
    common_code_operation: CommonCodeOperation, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await common_code_service.operate_common_codes(
        common_code_operation=common_code_operation, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)
