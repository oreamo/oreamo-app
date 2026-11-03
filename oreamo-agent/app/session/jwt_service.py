from datetime import UTC, datetime, timedelta

import jwt

from app.core.config import settings
from app.session.session_schema import SessionUser

ALGORITHM = "HS256"


def generate_access_token(session_user: SessionUser) -> str:
    return _generate_token(session_user, settings.jwt_access_token_expire_seconds)


def generate_refresh_token(session_user: SessionUser) -> str:
    return _generate_token(session_user, settings.jwt_refresh_token_expire_seconds)


def decode_token(token: str) -> SessionUser:
    payload = jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
    username = payload.get("sub")
    role_code = payload.get("roleCode")
    if not username or not role_code:
        raise jwt.InvalidTokenError("Missing sub or roleCode claim")
    return SessionUser(username=username, role_code=role_code)


def _generate_token(session_user: SessionUser, expire_seconds: int) -> str:
    now = datetime.now(UTC)
    payload = {
        "username": session_user.username,
        "roleCode": session_user.role_code,
        "sub": session_user.username,
        "iat": now,
        "exp": now + timedelta(seconds=expire_seconds),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)
