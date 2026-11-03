from starlette.responses import Response

from app.core.config import settings


def set_token_cookies(
    response: Response, access_token: str, refresh_token: str
) -> None:
    response.set_cookie(
        key=settings.access_token_cookie,
        value=access_token,
        max_age=settings.jwt_access_token_expire_seconds,
        path="/",
        secure=settings.cookie_secure,
        httponly=True,
    )
    response.set_cookie(
        key=settings.refresh_token_cookie,
        value=refresh_token,
        max_age=settings.jwt_refresh_token_expire_seconds,
        path=settings.refresh_url,
        secure=settings.cookie_secure,
        httponly=True,
    )


def remove_token_cookies(response: Response) -> None:
    response.delete_cookie(
        key=settings.access_token_cookie,
        path="/",
        secure=settings.cookie_secure,
        httponly=True,
    )
    response.delete_cookie(
        key=settings.refresh_token_cookie,
        path=settings.refresh_url,
        secure=settings.cookie_secure,
        httponly=True,
    )
