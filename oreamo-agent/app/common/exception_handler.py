import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.common.exception import (
    AccessDeniedException,
    AuthenticationException,
    RestException,
    UploadSizeExceededException,
)
from app.common.schema import Failure, RestResponse
from app.common.translation_key import TranslationKey
from app.common.validation import get_failure_keys
from app.core.config import settings
from app.session.session_cookie_service import remove_token_cookies
from app.session.session_dependencies import get_current_user

logger = logging.getLogger(__name__)

# Paths which do not require authentication
UNAUTHENTICATED_PATHS = ("/session/login", "/translations/infos")
UNAUTHENTICATED_PATH_PREFIXES = ("/docs", "/redoc", "/openapi.json")


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(StarletteHTTPException, handle_http_exception)
    app.add_exception_handler(RequestValidationError, handle_validation_exception)
    app.add_exception_handler(
        UploadSizeExceededException, handle_upload_size_exceeded_exception
    )
    app.add_exception_handler(RestException, handle_rest_exception)
    app.add_exception_handler(AuthenticationException, handle_authentication_exception)
    app.add_exception_handler(AccessDeniedException, handle_access_denied_exception)


async def handle_http_exception(
    request: Request, exception: StarletteHTTPException
) -> Response:
    if authentication_exception := _authenticate(request):
        return await handle_authentication_exception(request, authentication_exception)

    logger.error("[HTTP] : %s %s", exception.status_code, exception.detail)
    return Response(status_code=exception.status_code)


async def handle_validation_exception(
    request: Request, exception: RequestValidationError
) -> Response:
    if authentication_exception := _authenticate(request):
        return await handle_authentication_exception(request, authentication_exception)

    failure_message_key, failure_label_keys = get_failure_keys(exception.errors()[0])
    logger.error("[VALIDATION] : %s", failure_message_key)
    return _to_json_response(
        status.HTTP_200_OK, Failure.of(failure_message_key, *failure_label_keys)
    )


async def handle_upload_size_exceeded_exception(
    request: Request, exception: UploadSizeExceededException
) -> Response:
    if authentication_exception := _authenticate(request):
        return await handle_authentication_exception(request, authentication_exception)

    logger.error(
        "[VALIDATION] : %s", TranslationKey.Common.Message.MAX_SIZE_VALIDATION_FAILURE
    )
    return _to_json_response(
        status.HTTP_200_OK,
        Failure.of(
            TranslationKey.Common.Message.MAX_SIZE_VALIDATION_FAILURE,
            TranslationKey.File.Label.FILES,
            f"{settings.upload_max_request_size_mb}MB",
        ),
    )


async def handle_rest_exception(request: Request, exception: RestException) -> Response:
    logger.error("[FAILURE] : %s", exception.translation_message_key)
    return _to_json_response(
        status.HTTP_200_OK,
        Failure.of(
            exception.translation_message_key, *exception.translation_label_keys
        ),
    )


async def handle_authentication_exception(
    request: Request, exception: AuthenticationException
) -> Response:
    if exception.failure_message_key is None:
        response = Response(status_code=status.HTTP_401_UNAUTHORIZED)
    else:
        response = _to_json_response(
            status.HTTP_401_UNAUTHORIZED, Failure.of(exception.failure_message_key)
        )
    if exception.remove_token_cookies:
        remove_token_cookies(response)
    return response


async def handle_access_denied_exception(
    request: Request, exception: AccessDeniedException
) -> Response:
    logger.error("[FORBIDDEN] : %s", exception)
    return _to_json_response(
        status.HTTP_403_FORBIDDEN,
        Failure.of(TranslationKey.User.Message.AUTHORIZATION_FAILURE),
    )


async def handle_exception(request: Request, exception: Exception) -> Response:
    logger.error("[ERROR] : %s", exception)
    return _to_json_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        Failure.of(TranslationKey.Common.Message.INTERNAL_SERVER_ERROR_FAILURE),
    )


def _authenticate(request: Request) -> AuthenticationException | None:
    """Authenticate before the request fails, so authentication runs before routing and parsing."""
    path = request.url.path
    if path in UNAUTHENTICATED_PATHS or path.startswith(UNAUTHENTICATED_PATH_PREFIXES):
        return None
    try:
        get_current_user(request.cookies.get(settings.access_token_cookie))
    except AuthenticationException as e:
        return e
    return None


def _to_json_response(status_code: int, failure: Failure) -> JSONResponse:
    rest_response = RestResponse.of_failure(failure)
    return JSONResponse(
        status_code=status_code,
        content=rest_response.model_dump(mode="json", by_alias=True),
    )
