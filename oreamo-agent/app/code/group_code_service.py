from collections import defaultdict

from sqlalchemy import delete, exists, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.code import common_code_service
from app.code.common_code_model import CommonCodeEntity
from app.code.common_code_schema import CommonCode, CommonCodesSearch
from app.code.group_code_model import GroupCodeEntity
from app.code.group_code_schema import (
    GroupCode,
    GroupCodeDelete,
    GroupCodeOperation,
    GroupCodeSave,
    GroupCodeSearch,
    GroupCodesSearch,
    GroupCodeUpdate,
)
from app.common.exception import RestException
from app.common.pagination import paginate
from app.common.schema import PageResponse
from app.common.translation_key import TranslationKey


async def get_group_codes(
    *, group_codes_search: GroupCodesSearch, db: AsyncSession
) -> PageResponse[GroupCode]:
    query = select(GroupCodeEntity)
    if group_codes_search.group_codes:
        query = query.where(
            GroupCodeEntity.group_code.in_(group_codes_search.group_codes)
        )
    if group_codes_search.group_code:
        query = query.where(GroupCodeEntity.group_code == group_codes_search.group_code)
    if group_codes_search.group_code_name:
        query = query.where(
            GroupCodeEntity.group_code_name.contains(group_codes_search.group_code_name)
        )
    if group_codes_search.common_code_name:
        query = query.where(
            exists().where(
                CommonCodeEntity.group_code == GroupCodeEntity.group_code,
                CommonCodeEntity.common_code_name.contains(
                    group_codes_search.common_code_name
                ),
            )
        )
    if group_codes_search.data_status:
        query = query.where(
            GroupCodeEntity.data_status == group_codes_search.data_status
        )
    query = query.order_by(GroupCodeEntity.sort_order)

    group_codes = await paginate(
        query=query, pagination=group_codes_search, schema=GroupCode, db=db
    )

    if group_codes.items and group_codes_search.include_common_codes:
        common_codes = await common_code_service.get_common_codes(
            common_codes_search=CommonCodesSearch(
                group_codes=[group_code.group_code for group_code in group_codes.items]
            ),
            db=db,
        )
        group_code_common_codes: dict[str, list[CommonCode]] = defaultdict(list)
        for common_code in common_codes.items:
            group_code_common_codes[common_code.group_code].append(common_code)
        for group_code in group_codes.items:
            group_code.common_codes = group_code_common_codes.get(
                group_code.group_code, []
            )

    return group_codes


async def get_group_code(
    *, group_code_search: GroupCodeSearch, db: AsyncSession
) -> GroupCode:
    group_code = await _select_group_code(group_code_search=group_code_search, db=db)
    if group_code is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.Code.Label.GROUP_CODE,
        )
    return group_code


async def save_group_code(
    *, group_code_save: GroupCodeSave, author: str, db: AsyncSession
) -> GroupCode:
    group_code_search = GroupCodeSearch.of_group_code(group_code_save.group_code)
    if await _select_group_code(group_code_search=group_code_search, db=db) is not None:
        raise RestException(
            TranslationKey.Common.Message.DUPLICATE_FAILURE,
            TranslationKey.Code.Label.GROUP_CODE,
            group_code_save.group_code,
        )

    result = await db.execute(
        insert(GroupCodeEntity).values(
            group_code=group_code_save.group_code,
            group_code_name=group_code_save.group_code_name,
            group_code_description=group_code_save.group_code_description,
            data_status=group_code_save.data_status,
            sort_order=group_code_save.sort_order,
            created_by=author,
            updated_by=author,
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)

    group_code = await _select_group_code(group_code_search=group_code_search, db=db)
    if group_code is None:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)
    return group_code


async def update_group_code(
    *, group_code_update: GroupCodeUpdate, author: str, db: AsyncSession
) -> GroupCode:
    group_code_search = GroupCodeSearch.of_group_code(group_code_update.group_code)
    group_code = await get_group_code(group_code_search=group_code_search, db=db)

    result = await db.execute(
        update(GroupCodeEntity)
        .where(GroupCodeEntity.group_code == group_code_update.group_code)
        .values(
            group_code_name=group_code_update.group_code_name,
            group_code_description=group_code_update.group_code_description,
            data_status=group_code_update.data_status,
            updated_by=author,
            updated_at=func.now(),
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)

    if group_code_update.has_data_status_changed(group_code):
        await db.execute(
            update(CommonCodeEntity)
            .where(CommonCodeEntity.group_code == group_code_update.group_code)
            .values(
                data_status=group_code_update.data_status,
                updated_by=author,
                updated_at=func.now(),
            )
        )

    updated_group_code = await _select_group_code(
        group_code_search=group_code_search, db=db
    )
    if updated_group_code is None:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)
    return updated_group_code


async def delete_group_code(
    *, group_code_delete: GroupCodeDelete, author: str, db: AsyncSession
) -> None:
    group_code_search = GroupCodeSearch.of_group_code(group_code_delete.group_code)
    group_code = await _select_group_code(group_code_search=group_code_search, db=db)
    if group_code is None:
        raise RestException(TranslationKey.Common.Message.NOT_FOUND_FAILURE)

    if group_code.has_enabled_common_codes():
        raise RestException(
            TranslationKey.Code.Message.GROUP_CODE_DELETE_FAILURE_BY_ENABLED_COMMON_CODE
        )

    if group_code.has_common_codes():
        await db.execute(
            delete(CommonCodeEntity).where(
                CommonCodeEntity.group_code == group_code_delete.group_code
            )
        )

    result = await db.execute(
        delete(GroupCodeEntity).where(
            GroupCodeEntity.group_code == group_code_delete.group_code
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.DELETE_FAILURE)


async def operate_group_codes(
    *, group_code_operation: GroupCodeOperation, author: str, db: AsyncSession
) -> None:
    for group_code_delete in group_code_operation.group_code_deletes or []:
        await delete_group_code(
            group_code_delete=group_code_delete, author=author, db=db
        )

    for group_code_update in group_code_operation.group_code_updates or []:
        await update_group_code(
            group_code_update=group_code_update, author=author, db=db
        )

    for group_code_save in group_code_operation.group_code_saves or []:
        await save_group_code(group_code_save=group_code_save, author=author, db=db)


async def _select_group_code(
    *, group_code_search: GroupCodeSearch, db: AsyncSession
) -> GroupCode | None:
    query = select(GroupCodeEntity)
    if group_code_search.group_code:
        query = query.where(GroupCodeEntity.group_code == group_code_search.group_code)
    if group_code_search.data_status:
        query = query.where(
            GroupCodeEntity.data_status == group_code_search.data_status
        )

    entity = (await db.execute(query)).scalar_one_or_none()
    if entity is None:
        return None

    common_codes = await db.scalars(
        select(CommonCodeEntity)
        .where(CommonCodeEntity.group_code == entity.group_code)
        .order_by(CommonCodeEntity.sort_order)
    )
    group_code = GroupCode.model_validate(entity)
    group_code.common_codes = [
        CommonCode.model_validate(common_code) for common_code in common_codes
    ]
    return group_code
