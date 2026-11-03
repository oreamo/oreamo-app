import logging

from sqlalchemy import func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import DataStatus
from app.common.exception import RestException
from app.common.translation_key import TranslationKey
from app.file import file_storage
from app.file.file_model import FileEntity
from app.file.file_schema import (
    FileDelete,
    FileDownload,
    FileDownloadInfo,
    FileGroup,
    FileInfo,
    FileSearch,
    FilesSearch,
    FileStorageUpload,
    FileUpload,
)

logger = logging.getLogger(__name__)

UPLOAD_FILE_MAX_SIZE = 10 * 1024 * 1024
UPLOAD_FILE_MAX_SIZE_LABEL = "10MB"


async def get_file_group(*, files_search: FilesSearch, db: AsyncSession) -> FileGroup:
    result = await db.execute(
        select(FileEntity)
        .where(
            FileEntity.file_group_id == files_search.file_group_id,
            FileEntity.data_status == DataStatus.ENABLED,
        )
        .order_by(FileEntity.created_at, FileEntity.file_name)
    )
    file_infos = [FileInfo.model_validate(entity) for entity in result.scalars().all()]
    return FileGroup(file_group_id=files_search.file_group_id, files=file_infos)


async def download_file(
    *, file_download: FileDownload, db: AsyncSession
) -> FileDownloadInfo:
    file_info = await _select_file(
        file_search=FileSearch.of_file_id(file_download.file_id), db=db
    )
    if file_info is None or file_info.file_path is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.File.Label.FILES,
        )

    content = await file_storage.download(file_info.file_path)
    return FileDownloadInfo.of_file_info(file_info, content)


async def upload_files(
    *, file_upload: FileUpload, author: str, db: AsyncSession
) -> FileGroup:
    if not file_upload.has_targets():
        raise RestException(
            TranslationKey.Common.Message.REQUIRED_VALIDATION_FAILURE,
            TranslationKey.File.Label.FILES,
        )

    if file_upload.has_larger_file_than(UPLOAD_FILE_MAX_SIZE):
        raise RestException(
            TranslationKey.Common.Message.MAX_SIZE_VALIDATION_FAILURE,
            TranslationKey.File.Label.FILES,
            UPLOAD_FILE_MAX_SIZE_LABEL,
        )

    if file_upload.has_file_group_id() and file_upload.file_group_id:
        file_group = await get_file_group(
            files_search=FilesSearch.of_file_group_id(file_upload.file_group_id), db=db
        )
        if not file_group.files:
            raise RestException(
                TranslationKey.Common.Message.NOT_FOUND_FAILURE,
                TranslationKey.File.Label.FILES,
            )

    file_group_id = file_upload.resolve_file_group_id()

    if file_upload.has_delete_targets():
        await _delete_files(
            file_group_id=file_group_id,
            delete_file_ids=file_upload.delete_file_ids,
            author=author,
            db=db,
        )

    if file_upload.has_upload_targets():
        await _store_files(
            file_storage_uploads=file_upload.to_file_storage_uploads(file_group_id),
            author=author,
            db=db,
        )

    return await get_file_group(
        files_search=FilesSearch.of_file_group_id(file_group_id), db=db
    )


async def delete_file(
    *, file_delete: FileDelete, author: str, db: AsyncSession
) -> FileGroup:
    file_info = await _select_file(
        file_search=FileSearch.of_file_id(file_delete.file_id), db=db
    )
    if file_info is None or file_info.file_group_id is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.File.Label.FILES,
        )

    result = await db.execute(
        update(FileEntity)
        .where(
            FileEntity.file_id == file_delete.file_id,
            FileEntity.data_status == DataStatus.ENABLED,
        )
        .values(
            data_status=DataStatus.DISABLED, updated_by=author, updated_at=func.now()
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.DELETE_FAILURE)

    return await get_file_group(
        files_search=FilesSearch.of_file_group_id(file_info.file_group_id), db=db
    )


async def _select_file(*, file_search: FileSearch, db: AsyncSession) -> FileInfo | None:
    result = await db.execute(
        select(FileEntity).where(
            FileEntity.file_id == file_search.file_id,
            FileEntity.data_status == DataStatus.ENABLED,
        )
    )
    entity = result.scalar_one_or_none()
    return FileInfo.model_validate(entity) if entity is not None else None


async def _delete_files(
    *, file_group_id: str, delete_file_ids: list[str], author: str, db: AsyncSession
) -> None:
    result = await db.execute(
        update(FileEntity)
        .where(
            FileEntity.file_group_id == file_group_id,
            FileEntity.file_id.in_(delete_file_ids),
            FileEntity.data_status == DataStatus.ENABLED,
        )
        .values(
            data_status=DataStatus.DISABLED, updated_by=author, updated_at=func.now()
        )
    )
    if result.rowcount != len(delete_file_ids):
        raise RestException(TranslationKey.Common.Message.DELETE_FAILURE)


async def _store_files(
    *, file_storage_uploads: list[FileStorageUpload], author: str, db: AsyncSession
) -> None:
    uploaded_file_storage_uploads: list[FileStorageUpload] = []
    try:
        for file_storage_upload in file_storage_uploads:
            await file_storage.upload(file_storage_upload)
            uploaded_file_storage_uploads.append(file_storage_upload)

        result = await db.execute(
            insert(FileEntity).values(
                [
                    {
                        "file_id": file_storage_upload.file_id,
                        "file_group_id": file_storage_upload.file_group_id,
                        "file_name": file_storage_upload.file_name,
                        "file_extension": file_storage_upload.file_extension,
                        "file_content_type": file_storage_upload.file_content_type,
                        "file_size": file_storage_upload.file_size,
                        "file_path": file_storage_upload.file_path,
                        "created_by": author,
                        "updated_by": author,
                    }
                    for file_storage_upload in file_storage_uploads
                ]
            )
        )
        if result.rowcount != len(file_storage_uploads):
            raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)
    except Exception:
        # Roll back the stored objects since the database changes are rolled back as well
        for uploaded_file_storage_upload in uploaded_file_storage_uploads:
            await _delete_uploaded_file(uploaded_file_storage_upload)
        raise


async def _delete_uploaded_file(
    uploaded_file_storage_upload: FileStorageUpload,
) -> None:
    try:
        await file_storage.delete(uploaded_file_storage_upload.file_path)
    except Exception as e:
        logger.warning(
            "Failed to delete uploaded file %s: %s",
            uploaded_file_storage_upload.file_path,
            e,
        )
