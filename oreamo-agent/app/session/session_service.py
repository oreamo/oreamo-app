import logging

import jwt
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.exception import AuthenticationException
from app.common.translation_key import TranslationKey
from app.core.config import settings
from app.core.security import verify_password
from app.session import jwt_service
from app.session.session_schema import SessionUser
from app.user import user_service
from app.user.user_schema import UserSearch

logger = logging.getLogger(__name__)


async def login(
    *, username: str | None, password: str | None, db: AsyncSession, redis: Redis
) -> tuple[str, str]:
    user = None
    if username:
        user = await user_service.find_user(
            user_search=UserSearch.of_username(username), db=db
        )

    if user is None:
        logger.error("Username %s not found", username)
        raise AuthenticationException(
            failure_message_key=TranslationKey.User.Message.AUTHENTICATION_FAILURE
        )

    if (
        not password
        or not user.password
        or not await verify_password(password, user.password)
    ):
        raise AuthenticationException(
            failure_message_key=TranslationKey.User.Message.AUTHENTICATION_FAILURE
        )

    session_user = SessionUser(username=user.username, role_code=user.role_code)
    return await _issue_tokens(session_user=session_user, redis=redis)


async def refresh_session(
    *, refresh_token: str | None, redis: Redis
) -> tuple[str, str]:
    if not refresh_token:
        raise AuthenticationException()

    try:
        session_user = jwt_service.decode_token(refresh_token)
    except jwt.PyJWTError as e:
        logger.warning("Invalid or expired refresh token: %s", e)
        raise AuthenticationException() from e

    cached_refresh_token = await redis.getdel(session_user.username)
    if cached_refresh_token is None:
        logger.warning(
            "No refresh token found in Redis for user: %s", session_user.username
        )
        raise AuthenticationException()

    if cached_refresh_token != refresh_token:
        logger.warning("Refresh token mismatch for user: %s", session_user.username)
        raise AuthenticationException()

    return await _issue_tokens(session_user=session_user, redis=redis)


async def logout(*, username: str, redis: Redis) -> None:
    await redis.delete(username)


async def _issue_tokens(*, session_user: SessionUser, redis: Redis) -> tuple[str, str]:
    access_token = jwt_service.generate_access_token(session_user)
    refresh_token = jwt_service.generate_refresh_token(session_user)
    await redis.setex(
        session_user.username,
        settings.jwt_refresh_token_expire_seconds,
        refresh_token,
    )
    return access_token, refresh_token
