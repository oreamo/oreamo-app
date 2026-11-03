from urllib.parse import parse_qsl, urlencode

from starlette.datastructures import Headers
from starlette.requests import Request
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from app.common.exception import UploadSizeExceededException
from app.common.exception_handler import handle_exception


class ArrayQueryParamMiddleware:
    """Normalize `key[]=value` query params (axios default array format) into `key=value`."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            query_params = parse_qsl(
                scope["query_string"].decode("latin-1"), keep_blank_values=True
            )
            if any(key.endswith("[]") for key, _ in query_params):
                normalized_query_params = [
                    (key.removesuffix("[]"), value) for key, value in query_params
                ]
                scope = {
                    **scope,
                    "query_string": urlencode(normalized_query_params).encode(
                        "latin-1"
                    ),
                }
        await self.app(scope, receive, send)


class UploadSizeLimitMiddleware:
    def __init__(self, app: ASGIApp, max_request_size: int) -> None:
        self.app = app
        self.max_request_size = max_request_size

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            headers = Headers(scope=scope)
            if headers.get("content-type", "").startswith("multipart/form-data"):
                receive = self._limit_receive(receive, headers.get("content-length"))
        await self.app(scope, receive, send)

    def _limit_receive(self, receive: Receive, content_length: str | None) -> Receive:
        received_size = 0

        async def limited_receive() -> Message:
            nonlocal received_size
            if content_length and content_length.isdigit():
                if int(content_length) > self.max_request_size:
                    raise UploadSizeExceededException()

            message = await receive()
            if message["type"] == "http.request":
                received_size += len(message.get("body", b""))
                if received_size > self.max_request_size:
                    raise UploadSizeExceededException()
            return message

        return limited_receive


class UnhandledExceptionMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        response_started = False

        async def tracked_send(message: Message) -> None:
            nonlocal response_started
            if message["type"] == "http.response.start":
                response_started = True
            await send(message)

        try:
            await self.app(scope, receive, tracked_send)
        except Exception as e:
            if response_started:
                raise
            response = await handle_exception(Request(scope), e)
            await response(scope, receive, send)
