from sqlalchemy import delete, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.code.common_code_model import CommonCodeEntity
from app.code.common_code_schema import (
    CommonCode,
    CommonCodeDelete,
    CommonCodeOperation,
    CommonCodeSave,
    CommonCodeSearch,
    CommonCodesSearch,
    CommonCodeUpdate,
)
from app.common.exception import RestException
from app.common.pagination import paginate
from app.common.schema import PageResponse
from app.common.translation_key import TranslationKey


async def get_common_codes(
    *, common_codes_search: CommonCodesSearch, db: AsyncSession
) -> PageResponse[CommonCode]:
    query = select(CommonCodeEntity)
    if common_codes_search.group_codes:
        query = query.where(
            CommonCodeEntity.group_code.in_(common_codes_search.group_codes)
        )
    if common_codes_search.group_code:
        query = query.where(
            CommonCodeEntity.group_code == common_codes_search.group_code
        )
    if common_codes_search.common_code:
        query = query.where(
            CommonCodeEntity.common_code == common_codes_search.common_code
        )
    if common_codes_search.data_status:
        query = query.where(
            CommonCodeEntity.data_status == common_codes_search.data_status
        )
    query = query.order_by(CommonCodeEntity.sort_order)

    return await paginate(
        query=query, pagination=common_codes_search, schema=CommonCode, db=db
    )


async def get_common_code(
    *, common_code_search: CommonCodeSearch, db: AsyncSession
) -> CommonCode:
    common_code = await _select_common_code(
        common_code_search=common_code_search, db=db
    )
    if common_code is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.Code.Label.COMMON_CODE,
        )
    return common_code


async def save_common_code(
    *, common_code_save: CommonCodeSave, author: str, db: AsyncSession
) -> CommonCode:
    common_code_search = CommonCodeSearch.of_code(
        common_code_save.group_code, common_code_save.common_code
    )
    if (
        await _select_common_code(common_code_search=common_code_search, db=db)
        is not None
    ):
        raise RestException(
            TranslationKey.Common.Message.DUPLICATE_FAILURE,
            TranslationKey.Code.Label.COMMON_CODE,
            common_code_save.common_code,
        )

    result = await db.execute(
        insert(CommonCodeEntity).values(
            group_code=common_code_save.group_code,
            common_code=common_code_save.common_code,
            common_code_name=common_code_save.common_code_name,
            common_code_description=common_code_save.common_code_description,
            data_status=common_code_save.data_status,
            sort_order=common_code_save.sort_order,
            created_by=author,
            updated_by=author,
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)

    common_code = await _select_common_code(
        common_code_search=common_code_search, db=db
    )
    if common_code is None:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)
    return common_code


async def update_common_code(
    *, common_code_update: CommonCodeUpdate, author: str, db: AsyncSession
) -> CommonCode:
    common_code_search = CommonCodeSearch.of_code(
        common_code_update.group_code, common_code_update.common_code
    )
    await get_common_code(common_code_search=common_code_search, db=db)

    result = await db.execute(
        update(CommonCodeEntity)
        .where(
            CommonCodeEntity.group_code == common_code_update.group_code,
            CommonCodeEntity.common_code == common_code_update.common_code,
        )
        .values(
            common_code_name=common_code_update.common_code_name,
            common_code_description=common_code_update.common_code_description,
            data_status=common_code_update.data_status,
            updated_by=author,
            updated_at=func.now(),
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)

    common_code = await _select_common_code(
        common_code_search=common_code_search, db=db
    )
    if common_code is None:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)
    return common_code


async def delete_common_code(
    *, common_code_delete: CommonCodeDelete, author: str, db: AsyncSession
) -> None:
    common_code_search = CommonCodeSearch.of_code(
        common_code_delete.group_code, common_code_delete.common_code
    )
    await get_common_code(common_code_search=common_code_search, db=db)

    result = await db.execute(
        delete(CommonCodeEntity).where(
            CommonCodeEntity.group_code == common_code_delete.group_code,
            CommonCodeEntity.common_code == common_code_delete.common_code,
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.DELETE_FAILURE)


async def operate_common_codes(
    *, common_code_operation: CommonCodeOperation, author: str, db: AsyncSession
) -> None:
    for common_code_delete in common_code_operation.common_code_deletes or []:
        await delete_common_code(
            common_code_delete=common_code_delete, author=author, db=db
        )

    for common_code_update in common_code_operation.common_code_updates or []:
        await update_common_code(
            common_code_update=common_code_update, author=author, db=db
        )

    for common_code_save in common_code_operation.common_code_saves or []:
        await save_common_code(common_code_save=common_code_save, author=author, db=db)


async def _select_common_code(
    *, common_code_search: CommonCodeSearch, db: AsyncSession
) -> CommonCode | None:
    query = select(CommonCodeEntity)
    if common_code_search.group_code:
        query = query.where(
            CommonCodeEntity.group_code == common_code_search.group_code
        )
    if common_code_search.common_code:
        query = query.where(
            CommonCodeEntity.common_code == common_code_search.common_code
        )
    if common_code_search.data_status:
        query = query.where(
            CommonCodeEntity.data_status == common_code_search.data_status
        )

    entity = (await db.execute(query)).scalar_one_or_none()
    return CommonCode.model_validate(entity) if entity is not None else None
