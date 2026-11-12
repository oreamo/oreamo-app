import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.common.exception import RestException
from app.common.schema import Failure, RestResponse
from app.common.translation_key import TranslationKey
from app.common.validation import get_failure_keys

logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(StarletteHTTPException, handle_http_exception)
    app.add_exception_handler(RequestValidationError, handle_validation_exception)
    app.add_exception_handler(RestException, handle_rest_exception)


async def handle_http_exception(
    request: Request, exception: StarletteHTTPException
) -> Response:
    logger.error("[HTTP] : %s %s", exception.status_code, exception.detail)
    return Response(status_code=exception.status_code)


async def handle_validation_exception(
    request: Request, exception: RequestValidationError
) -> Response:
    failure_message_key, failure_label_keys = get_failure_keys(exception.errors()[0])
    logger.error("[VALIDATION] : %s", failure_message_key)
    return _to_json_response(
        status.HTTP_200_OK, Failure.of(failure_message_key, *failure_label_keys)
    )


async def handle_rest_exception(request: Request, exception: RestException) -> Response:
    logger.error("[FAILURE] : %s", exception.translation_message_key)
    return _to_json_response(
        status.HTTP_200_OK,
        Failure.of(
            exception.translation_message_key, *exception.translation_label_keys
        ),
    )


async def handle_exception(request: Request, exception: Exception) -> Response:
    logger.error("[ERROR] : %s", exception)
    return _to_json_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        Failure.of(TranslationKey.Common.Message.INTERNAL_SERVER_ERROR_FAILURE),
    )


def _to_json_response(status_code: int, failure: Failure) -> JSONResponse:
    rest_response = RestResponse.of_failure(failure)
    return JSONResponse(
        status_code=status_code,
        content=rest_response.model_dump(mode="json", by_alias=True),
    )
