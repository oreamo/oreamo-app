from typing import Annotated

from fastapi import APIRouter, Query

from app.authority.permission_schema import PermissionCode
from app.common.schema import PageResponse, RestResponse
from app.core.database import DbSession
from app.session.session_dependencies import CurrentUser, authorize
from app.translation import translation_service
from app.translation.translation_schema import (
    Translation,
    TranslationDelete,
    TranslationInfo,
    TranslationOperation,
    TranslationSave,
    TranslationSearch,
    TranslationUpdate,
)

# Every path operation except `/infos` requires authentication through `authorize`.
router = APIRouter(prefix="/translations", tags=["Translation"])


@router.get(
    "",
    summary="Get Translations",
    dependencies=[authorize(PermissionCode.TRANSLATION_MANAGEMENT_READ)],
)
async def get_translations(
    translation_search: Annotated[TranslationSearch, Query()], db: DbSession
) -> RestResponse[PageResponse[Translation]]:
    translations = await translation_service.get_translations(
        translation_search=translation_search, db=db
    )
    return RestResponse.of_success(translations)


@router.get("/infos", summary="Get Translation Information")
async def get_translation_infos(db: DbSession) -> RestResponse[list[TranslationInfo]]:
    translation_infos = await translation_service.get_translation_infos(db=db)
    return RestResponse.of_success(translation_infos)


@router.post(
    "",
    summary="Post Translation",
    dependencies=[authorize(PermissionCode.TRANSLATION_MANAGEMENT_WRITE)],
)
async def post_translation(
    translation_save: TranslationSave, current_user: CurrentUser, db: DbSession
) -> RestResponse[Translation]:
    translation = await translation_service.save_translation(
        translation_save=translation_save, author=current_user.username, db=db
    )
    return RestResponse.of_success(translation)


@router.put(
    "/{translation_code}",
    summary="Put Translation",
    dependencies=[authorize(PermissionCode.TRANSLATION_MANAGEMENT_WRITE)],
)
async def put_translation(
    translation_code: str,
    translation_update: TranslationUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[Translation]:
    translation = await translation_service.update_translation(
        translation_update=translation_update, author=current_user.username, db=db
    )
    return RestResponse.of_success(translation)


@router.delete(
    "/{translation_code}",
    summary="Delete Translation",
    dependencies=[authorize(PermissionCode.TRANSLATION_MANAGEMENT_WRITE)],
)
async def delete_translation(
    translation_code: str,
    translation_delete: TranslationDelete,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[bool]:
    await translation_service.delete_translation(
        translation_delete=translation_delete, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)


@router.post(
    "/operation",
    summary="Operate Translations",
    dependencies=[authorize(PermissionCode.TRANSLATION_MANAGEMENT_WRITE)],
)
async def operate_translations(
    translation_operation: TranslationOperation,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[bool]:
    await translation_service.operate_translations(
        translation_operation=translation_operation, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)
