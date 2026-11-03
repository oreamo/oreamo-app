from typing import Annotated

from fastapi import APIRouter, Cookie, Response

from app.authority import permission_service
from app.authority.permission_schema import PermissionsSearch
from app.common.schema import RestResponse
from app.core.config import settings
from app.core.database import DbSession
from app.core.redis import RedisClient
from app.session import session_service
from app.session.session_cookie_service import remove_token_cookies, set_token_cookies
from app.session.session_dependencies import CurrentUser
from app.session.session_schema import LoginRequest, SessionUserInfo
from app.user import user_service
from app.user.user_schema import UserProfileImageUpdate, UserSearch

router = APIRouter(prefix="/session", tags=["Session"])


@router.post("/login", summary="Login")
async def login(
    login_request: LoginRequest,
    response: Response,
    db: DbSession,
    redis: RedisClient,
) -> RestResponse[None]:
    access_token, refresh_token = await session_service.login(
        username=login_request.username,
        password=login_request.password,
        db=db,
        redis=redis,
    )
    set_token_cookies(response, access_token, refresh_token)
    return RestResponse.of_success(None)


@router.get(
    "/user-info",
    summary="Get Session Info",
    description="Get information about authenticated session user",
)
async def get_session_user_info(
    current_user: CurrentUser, db: DbSession
) -> RestResponse[SessionUserInfo]:
    permissions = await permission_service.get_permissions(
        permissions_search=PermissionsSearch.of_enabled_role_code(
            current_user.role_code
        ),
        db=db,
    )
    permission_codes = [permission.permission_code for permission in permissions.items]
    user_profile_image = await user_service.get_user_profile_image(
        user_search=UserSearch.of_username(current_user.username), db=db
    )
    session_user_info = current_user.to_public_info(
        permission_codes, user_profile_image
    )
    return RestResponse.of_success(session_user_info)


@router.put(
    "/profile-image",
    summary="Put Session Profile Image",
    description="Set profile image of authenticated session user",
)
async def put_profile_image(
    user_profile_image_update: UserProfileImageUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> RestResponse[None]:
    await user_service.update_user_profile_image(
        username=current_user.username,
        user_profile_image_update=user_profile_image_update,
        author=current_user.username,
        db=db,
    )
    return RestResponse.of_success(None)


@router.delete(
    "/profile-image",
    summary="Delete Session Profile Image",
    description="Remove profile image of authenticated session user",
)
async def delete_profile_image(
    current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await user_service.delete_user_profile_image(
        username=current_user.username, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)


@router.put(
    "/refresh",
    summary="Refresh Session",
    description="Reissue access and refresh tokens using a valid refresh token",
)
async def refresh_session(
    response: Response,
    redis: RedisClient,
    refresh_token: Annotated[
        str | None, Cookie(alias=settings.refresh_token_cookie)
    ] = None,
) -> RestResponse[None]:
    access_token, new_refresh_token = await session_service.refresh_session(
        refresh_token=refresh_token, redis=redis
    )
    set_token_cookies(response, access_token, new_refresh_token)
    return RestResponse.of_success(None)


@router.delete(
    "", summary="Logout", description="Invalidate session and remove token cookies"
)
async def logout(
    current_user: CurrentUser, response: Response, redis: RedisClient
) -> RestResponse[bool]:
    await session_service.logout(username=current_user.username, redis=redis)
    remove_token_cookies(response)
    return RestResponse.of_success(True)
