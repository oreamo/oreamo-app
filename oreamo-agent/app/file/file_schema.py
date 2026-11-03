import re
import uuid
from collections.abc import Iterator
from dataclasses import dataclass, field
from typing import BinaryIO
from urllib.parse import quote

from pydantic import Field
from pydantic.json_schema import SkipJsonSchema

from app.common.schema import Schema

IMAGE_CONTENT_TYPES = frozenset({"image/png", "image/jpeg", "image/webp", "image/gif"})
DEFAULT_CONTENT_TYPE = "application/octet-stream"
RFC5987_SAFE_CHARS = "!#$&+^`|"
TOKEN_PATTERN = re.compile(r"[!#$%&'*+\-.^_`|~0-9A-Za-z]+")
MEDIA_TYPE_PARAMETER_SEPARATOR = re.compile(r';(?=(?:[^"]*"[^"]*")*[^"]*$)')


class FileInfo(Schema):
    file_id: str = Field(description="File ID")
    file_name: str = Field(description="File Name")
    file_extension: str = Field(description="File Extension")
    file_content_type: str = Field(description="File Content Type")
    file_size: int = Field(description="File Size")
    file_group_id: SkipJsonSchema[str | None] = Field(default=None, exclude=True)
    file_path: SkipJsonSchema[str | None] = Field(default=None, exclude=True)

    def is_image(self) -> bool:
        return self.file_content_type in IMAGE_CONTENT_TYPES

    def is_larger_than(self, max_file_size: int) -> bool:
        return self.file_size > max_file_size


class FileGroup(Schema):
    file_group_id: str = Field(description="File Group ID")
    files: list[FileInfo] = Field(description="Files")

    def find_latest_file(self) -> FileInfo | None:
        return self.files[-1] if self.files else None


class FilesSearch(Schema):
    file_group_id: str = Field(description="File Group ID")

    @classmethod
    def of_file_group_id(cls, file_group_id: str) -> FilesSearch:
        return cls(file_group_id=file_group_id)


class FileSearch(Schema):
    file_id: str = Field(description="File ID")

    @classmethod
    def of_file_id(cls, file_id: str) -> FileSearch:
        return cls(file_id=file_id)


class FileDownload(Schema):
    file_id: str = Field(description="File ID")


class FileDelete(Schema):
    file_id: str = Field(description="File ID")


@dataclass(frozen=True)
class UploadSource:
    file_name: str | None
    content_type: str | None
    size: int
    file: BinaryIO


@dataclass(frozen=True)
class FileUpload:
    file_group_id: str | None = None
    upload_files: list[UploadSource] = field(default_factory=list)
    delete_file_ids: list[str] = field(default_factory=list)

    def has_file_group_id(self) -> bool:
        return bool(self.file_group_id and self.file_group_id.strip())

    def has_upload_targets(self) -> bool:
        return bool(self.upload_files)

    def has_delete_targets(self) -> bool:
        return bool(self.delete_file_ids)

    def has_targets(self) -> bool:
        return self.has_upload_targets() or self.has_delete_targets()

    def has_larger_file_than(self, max_file_size: int) -> bool:
        return any(
            upload_source.size > max_file_size for upload_source in self.upload_files
        )

    def resolve_file_group_id(self) -> str:
        if self.has_file_group_id() and self.file_group_id:
            return self.file_group_id
        return str(uuid.uuid4())

    def to_file_storage_uploads(self, file_group_id: str) -> list[FileStorageUpload]:
        return [
            FileStorageUpload.of(file_group_id, upload_source)
            for upload_source in self.upload_files
        ]


@dataclass(frozen=True)
class FileStorageUpload:
    file_id: str
    file_group_id: str
    file_name: str
    file_extension: str
    file_content_type: str
    file_size: int
    file_path: str
    file: BinaryIO

    @classmethod
    def of(cls, file_group_id: str, upload_source: UploadSource) -> FileStorageUpload:
        file_id = str(uuid.uuid4())
        file_name = (upload_source.file_name or "").rsplit("/", 1)[-1]
        _, separator, extension = file_name.rpartition(".")
        return cls(
            file_id=file_id,
            file_group_id=file_group_id,
            file_name=file_name,
            file_extension=extension if separator else "",
            file_content_type=upload_source.content_type or DEFAULT_CONTENT_TYPE,
            file_size=upload_source.size,
            file_path=f"{file_group_id}/{file_id}",
            file=upload_source.file,
        )


@dataclass(frozen=True)
class FileDownloadInfo:
    file_name: str
    file_content_type: str
    file_size: int
    content: Iterator[bytes]

    @classmethod
    def of_file_info(
        cls, file_info: FileInfo, content: Iterator[bytes]
    ) -> FileDownloadInfo:
        return cls(
            file_name=file_info.file_name,
            file_content_type=file_info.file_content_type,
            file_size=file_info.file_size,
            content=content,
        )

    def to_media_type(self) -> str:
        if not _is_concrete_media_type(self.file_content_type):
            return DEFAULT_CONTENT_TYPE
        return self.file_content_type

    def to_content_disposition(self) -> str:
        return _to_content_disposition("attachment", self.file_name)

    def to_view_content_disposition(self) -> str:
        if self.file_content_type not in IMAGE_CONTENT_TYPES:
            return self.to_content_disposition()
        return _to_content_disposition("inline", self.file_name)


def _to_content_disposition(disposition_type: str, file_name: str) -> str:
    fallback_file_name = "".join(
        char if ord(char) <= 0xFF else "_" for char in file_name
    )
    quoted_file_name = fallback_file_name.replace("\\", "\\\\").replace('"', '\\"')
    encoded_file_name = quote(file_name, safe=RFC5987_SAFE_CHARS)
    return (
        f'{disposition_type}; filename="{quoted_file_name}"; '
        f"filename*=UTF-8''{encoded_file_name}"
    )


def _is_concrete_media_type(media_type: str) -> bool:
    full_type, *parameters = MEDIA_TYPE_PARAMETER_SEPARATOR.split(media_type)
    type_, _, subtype = full_type.strip().partition("/")
    if not _is_token(type_) or not _is_token(subtype):
        return False
    if type_ == "*" or subtype == "*" or subtype.startswith("*+"):
        return False
    return all(_is_valid_media_type_parameter(parameter) for parameter in parameters)


def _is_valid_media_type_parameter(parameter: str) -> bool:
    attribute, separator, value = parameter.strip().partition("=")
    if not separator:
        return True
    value = value.strip()
    is_quoted = len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'"
    return _is_token(attribute.strip()) and (is_quoted or _is_token(value))


def _is_token(value: str) -> bool:
    return TOKEN_PATTERN.fullmatch(value) is not None
