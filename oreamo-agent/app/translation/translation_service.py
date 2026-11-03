from sqlalchemy import delete, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.exception import RestException
from app.common.pagination import paginate
from app.common.schema import PageResponse
from app.common.translation_key import TranslationKey
from app.translation.translation_model import TranslationEntity
from app.translation.translation_schema import (
    Translation,
    TranslationDelete,
    TranslationInfo,
    TranslationOperation,
    TranslationSave,
    TranslationSearch,
    TranslationUpdate,
)


async def get_translations(
    *, translation_search: TranslationSearch, db: AsyncSession
) -> PageResponse[Translation]:
    query = select(TranslationEntity)
    if translation_search.translation_group:
        query = query.where(
            TranslationEntity.translation_group == translation_search.translation_group
        )
    if translation_search.translation_type:
        query = query.where(
            TranslationEntity.translation_type == translation_search.translation_type
        )
    if translation_search.translation_code:
        query = query.where(
            TranslationEntity.translation_code.contains(
                translation_search.translation_code
            )
        )
    if translation_search.translation_locale:
        query = query.where(
            TranslationEntity.translation_locale
            == translation_search.translation_locale
        )
    if translation_search.data_status:
        query = query.where(
            TranslationEntity.data_status == translation_search.data_status
        )
    if translation_search.translation_key:
        translation_key = func.concat(
            TranslationEntity.translation_group,
            ".",
            TranslationEntity.translation_type,
            ".",
            TranslationEntity.translation_code,
        )
        query = query.where(
            translation_key.contains(translation_search.translation_key)
        )
    query = query.order_by(
        TranslationEntity.translation_group,
        TranslationEntity.translation_type,
        TranslationEntity.translation_code,
        TranslationEntity.translation_locale,
    )

    return await paginate(
        query=query, pagination=translation_search, schema=Translation, db=db
    )


async def get_translation_infos(*, db: AsyncSession) -> list[TranslationInfo]:
    translations = await get_translations(
        translation_search=TranslationSearch.of_enabled(), db=db
    )
    return [translation.to_translation_info() for translation in translations.items]


async def save_translation(
    *, translation_save: TranslationSave, author: str, db: AsyncSession
) -> Translation:
    translation_search = TranslationSearch.of_key(
        translation_save.translation_group,
        translation_save.translation_type,
        translation_save.translation_code,
        translation_save.translation_locale,
    )
    if (
        await _select_translation(translation_search=translation_search, db=db)
        is not None
    ):
        raise RestException(
            TranslationKey.Common.Message.DUPLICATE_FAILURE,
            TranslationKey.Translation.Label.TRANSLATION_CODE,
            translation_save.translation_code,
        )

    result = await db.execute(
        insert(TranslationEntity).values(
            translation_group=translation_save.translation_group,
            translation_type=translation_save.translation_type,
            translation_code=translation_save.translation_code,
            translation_locale=translation_save.translation_locale,
            translation_content=translation_save.translation_content,
            data_status=translation_save.data_status,
            created_by=author,
            updated_by=author,
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)

    translation = await _select_translation(
        translation_search=translation_search, db=db
    )
    if translation is None:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)
    return translation


async def update_translation(
    *, translation_update: TranslationUpdate, author: str, db: AsyncSession
) -> Translation:
    translation_search = TranslationSearch.of_key(
        translation_update.translation_group,
        translation_update.translation_type,
        translation_update.translation_code,
        translation_update.translation_locale,
    )
    if await _select_translation(translation_search=translation_search, db=db) is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.Translation.Label.TRANSLATION_CODE,
        )

    result = await db.execute(
        update(TranslationEntity)
        .where(*_key_criteria(translation_search))
        .values(
            translation_content=translation_update.translation_content,
            data_status=translation_update.data_status,
            updated_by=author,
            updated_at=func.now(),
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)

    translation = await _select_translation(
        translation_search=translation_search, db=db
    )
    if translation is None:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)
    return translation


async def delete_translation(
    *, translation_delete: TranslationDelete, author: str, db: AsyncSession
) -> None:
    translation_search = TranslationSearch.of_key(
        translation_delete.translation_group,
        translation_delete.translation_type,
        translation_delete.translation_code,
        translation_delete.translation_locale,
    )
    if await _select_translation(translation_search=translation_search, db=db) is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.Translation.Label.TRANSLATION_CODE,
        )

    result = await db.execute(
        delete(TranslationEntity).where(*_key_criteria(translation_search))
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.DELETE_FAILURE)


async def operate_translations(
    *, translation_operation: TranslationOperation, author: str, db: AsyncSession
) -> None:
    for translation_delete in translation_operation.translation_deletes or []:
        await delete_translation(
            translation_delete=translation_delete, author=author, db=db
        )

    for translation_update in translation_operation.translation_updates or []:
        await update_translation(
            translation_update=translation_update, author=author, db=db
        )

    for translation_save in translation_operation.translation_saves or []:
        await save_translation(translation_save=translation_save, author=author, db=db)


async def _select_translation(
    *, translation_search: TranslationSearch, db: AsyncSession
) -> Translation | None:
    query = select(TranslationEntity).where(*_key_criteria(translation_search))
    entity = (await db.execute(query)).scalar_one_or_none()
    return Translation.model_validate(entity) if entity is not None else None


def _key_criteria(translation_search: TranslationSearch) -> tuple:
    return (
        TranslationEntity.translation_group == translation_search.translation_group,
        TranslationEntity.translation_type == translation_search.translation_type,
        TranslationEntity.translation_code == translation_search.translation_code,
        TranslationEntity.translation_locale == translation_search.translation_locale,
    )
