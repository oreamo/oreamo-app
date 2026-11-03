from typing import Annotated

from fastapi import APIRouter, File, Form, Request, UploadFile
from fastapi.responses import StreamingResponse

from app.common.exception import RestException
from app.common.schema import RestResponse
from app.common.translation_key import TranslationKey
from app.core.database import DbSession
from app.file import file_service
from app.file.file_schema import (
    FileDelete,
    FileDownload,
    FileDownloadInfo,
    FileGroup,
    FilesSearch,
    FileUpload,
    UploadSource,
)
from app.session.session_dependencies import CurrentUser

router = APIRouter(prefix="/files", tags=["File"])


@router.get("/groups/{file_group_id}", summary="Get File Group")
async def get_file_group(file_group_id: str, db: DbSession) -> RestResponse[FileGroup]:
    file_group = await file_service.get_file_group(
        files_search=FilesSearch.of_file_group_id(file_group_id), db=db
    )
    return RestResponse.of_success(file_group)


@router.get("/{file_id}/download", summary="Download File")
async def download_file(file_id: str, db: DbSession) -> StreamingResponse:
    file_download_info = await file_service.download_file(
        file_download=FileDownload(file_id=file_id), db=db
    )
    return _to_streaming_response(
        file_download_info, file_download_info.to_content_disposition()
    )


@router.get(
    "/{file_id}/view",
    summary="View File",
    description="Show image files inline, download other files",
)
async def view_file(file_id: str, db: DbSession) -> StreamingResponse:
    file_download_info = await file_service.download_file(
        file_download=FileDownload(file_id=file_id), db=db
    )
    return _to_streaming_response(
        file_download_info, file_download_info.to_view_content_disposition()
    )


@router.post("", summary="Upload Files")
async def post_files(
    request: Request,
    current_user: CurrentUser,
    db: DbSession,
    file_group_id: Annotated[str | None, Form(alias="fileGroupId")] = None,
    upload_files: Annotated[list[UploadFile] | None, File(alias="uploadFiles")] = None,
    delete_file_ids: Annotated[list[str] | None, Form(alias="deleteFileIds")] = None,
) -> RestResponse[FileGroup]:
    if not _is_multipart(request):
        raise RestException(TranslationKey.Common.Message.REQUEST_VALIDATION_FAILURE)

    file_upload = FileUpload(
        file_group_id=file_group_id,
        upload_files=[
            UploadSource(
                file_name=upload_file.filename,
                content_type=upload_file.content_type,
                size=upload_file.size or 0,
                file=upload_file.file,
            )
            for upload_file in upload_files or []
        ],
        delete_file_ids=delete_file_ids or [],
    )
    file_group = await file_service.upload_files(
        file_upload=file_upload, author=current_user.username, db=db
    )
    return RestResponse.of_success(file_group)


@router.delete("/{file_id}", summary="Delete File")
async def delete_file(
    file_id: str, current_user: CurrentUser, db: DbSession
) -> RestResponse[FileGroup]:
    file_group = await file_service.delete_file(
        file_delete=FileDelete(file_id=file_id), author=current_user.username, db=db
    )
    return RestResponse.of_success(file_group)


def _is_multipart(request: Request) -> bool:
    content_type = request.headers.get("content-type", "")
    return content_type.split(";", 1)[0].strip().lower() == "multipart/form-data"


def _to_streaming_response(
    file_download_info: FileDownloadInfo, content_disposition: str
) -> StreamingResponse:
    # Set Content-Type as a header so Starlette does not append "; charset=utf-8" to text/*
    return StreamingResponse(
        file_download_info.content,
        headers={
            "Content-Type": file_download_info.to_media_type(),
            "Content-Length": str(file_download_info.file_size),
            "Content-Disposition": content_disposition,
        },
    )
