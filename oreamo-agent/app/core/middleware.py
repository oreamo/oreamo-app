import hmac

from starlette.datastructures import Headers
from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from app.common.exception_handler import handle_exception
from app.core.config import settings


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


class ServerKeyMiddleware:
    """Reject requests that do not carry the server key shared with the backend."""

    HEADER = "X-Oreamo-Server-Key"

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            server_key = Headers(scope=scope).get(self.HEADER, "")
            if not hmac.compare_digest(
                server_key.encode(), settings.oreamo_server_key.encode()
            ):
                response = Response(status_code=401)
                await response(scope, receive, send)
                return
        await self.app(scope, receive, send)
