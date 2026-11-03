import logging
from typing import Annotated, Any

import jwt
from fastapi import Cookie, Depends

from app.authority import permission_service
from app.authority.permission_schema import PermissionCode, PermissionsSearch
from app.common.exception import AccessDeniedException, AuthenticationException
from app.core.config import settings
from app.core.database import DbSession
from app.session import jwt_service
from app.session.session_schema import SessionUser

logger = logging.getLogger(__name__)


def get_current_user(
    access_token: Annotated[
        str | None, Cookie(alias=settings.access_token_cookie)
    ] = None,
) -> SessionUser:
    if not access_token:
        raise AuthenticationException(remove_token_cookies=False)

    try:
        return jwt_service.decode_token(access_token)
    except jwt.ExpiredSignatureError as e:
        logger.warning("Access token has been expired : %s", e)
        raise AuthenticationException(remove_token_cookies=False) from e
    except jwt.PyJWTError as e:
        logger.warning("Access token is invalid : %s", e)
        raise AuthenticationException() from e


CurrentUser = Annotated[SessionUser, Depends(get_current_user)]


def authorize(*permission_codes: PermissionCode) -> Any:
    """Allow the request only when the session user's role is granted any of the permission codes."""

    async def _authorize(current_user: CurrentUser, db: DbSession) -> None:
        permissions = await permission_service.get_permissions(
            permissions_search=PermissionsSearch.of_enabled_role_code(
                current_user.role_code
            ),
            db=db,
        )
        granted_permission_codes = [
            permission.permission_code for permission in permissions.items
        ]
        if not any(
            code.is_granted_in(granted_permission_codes) for code in permission_codes
        ):
            raise AccessDeniedException(
                "Authorization failed because user is not authorized."
            )

    return Depends(_authorize)
