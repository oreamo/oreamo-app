import asyncio
from collections.abc import Iterator

from app.common.exception import RestException
from app.common.translation_key import TranslationKey
from app.core.config import settings
from app.core.s3 import s3_client
from app.file.file_schema import FileStorageUpload


async def upload(file_storage_upload: FileStorageUpload) -> None:
    file_storage_upload.file.seek(0)
    await asyncio.to_thread(
        s3_client.put_object,
        Bucket=settings.aws_s3_bucket,
        Key=file_storage_upload.file_path,
        Body=file_storage_upload.file,
        ContentType=file_storage_upload.file_content_type,
        ContentLength=file_storage_upload.file_size,
    )


async def download(file_path: str) -> Iterator[bytes]:
    try:
        response = await asyncio.to_thread(
            s3_client.get_object, Bucket=settings.aws_s3_bucket, Key=file_path
        )
    except s3_client.exceptions.NoSuchKey as e:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.File.Label.FILES,
        ) from e
    return _iterate_body(response["Body"])


async def delete(file_path: str) -> None:
    await asyncio.to_thread(
        s3_client.delete_object, Bucket=settings.aws_s3_bucket, Key=file_path
    )


def _iterate_body(body) -> Iterator[bytes]:
    try:
        yield from body.iter_chunks()
    finally:
        body.close()
