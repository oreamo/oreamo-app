from fastapi import APIRouter, Depends

from app.authority import permission_router, role_router
from app.code import common_code_router, group_code_router
from app.file import file_router
from app.menu import menu_router
from app.session import session_router
from app.session.session_dependencies import get_current_user
from app.translation import translation_router
from app.user import user_router

router = APIRouter()

# Authentication is declared per path operation
router.include_router(session_router.router)
router.include_router(translation_router.router)

# Every path operation requires authentication
for authenticated_router in (
    permission_router.router,
    role_router.router,
    group_code_router.router,
    common_code_router.router,
    menu_router.router,
    user_router.router,
    file_router.router,
):
    router.include_router(
        authenticated_router, dependencies=[Depends(get_current_user)]
    )
