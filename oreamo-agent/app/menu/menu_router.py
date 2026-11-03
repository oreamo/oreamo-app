from typing import Annotated

from fastapi import APIRouter, Query

from app.authority.permission_schema import PermissionCode
from app.common.schema import PageResponse, RestResponse
from app.core.database import DbSession
from app.menu import menu_service
from app.menu.menu_schema import (
    Menu,
    MenuDelete,
    MenuOperate,
    MenuSave,
    MenuSearch,
    MenusSearch,
    MenuTreeNode,
    MenuUpdate,
)
from app.session.session_dependencies import CurrentUser, authorize

router = APIRouter(prefix="/menus", tags=["Menu"])


@router.get(
    "",
    summary="Get Menus",
    dependencies=[authorize(PermissionCode.MENU_MANAGEMENT_READ)],
)
async def get_menus(
    menus_search: Annotated[MenusSearch, Query()], db: DbSession
) -> RestResponse[PageResponse[Menu]]:
    menus = await menu_service.get_menus(menus_search=menus_search, db=db)
    return RestResponse.of_success(menus)


@router.get("/tree", summary="Get Menu Tree")
async def get_menu_tree(
    current_user: CurrentUser, db: DbSession
) -> RestResponse[list[MenuTreeNode]]:
    menu_tree = await menu_service.get_menu_tree(
        role_code=current_user.role_code, db=db
    )
    return RestResponse.of_success(menu_tree)


@router.get(
    "/{menu_id}",
    summary="Get Menu",
    dependencies=[authorize(PermissionCode.MENU_MANAGEMENT_READ)],
)
async def get_menu(
    menu_id: str,
    db: DbSession,
    data_status: Annotated[str | None, Query(alias="dataStatus")] = None,
) -> RestResponse[Menu]:
    menu = await menu_service.get_menu(
        menu_search=MenuSearch.of_menu_id(menu_id, data_status), db=db
    )
    return RestResponse.of_success(menu)


@router.post(
    "",
    summary="Post Menu",
    dependencies=[authorize(PermissionCode.MENU_MANAGEMENT_WRITE)],
)
async def post_menu(
    menu_save: MenuSave, current_user: CurrentUser, db: DbSession
) -> RestResponse[Menu]:
    menu = await menu_service.save_menu(
        menu_save=menu_save, author=current_user.username, db=db
    )
    return RestResponse.of_success(menu)


@router.put(
    "/{menu_id}",
    summary="Put Menu",
    dependencies=[authorize(PermissionCode.MENU_MANAGEMENT_WRITE)],
)
async def put_menu(
    menu_id: str, menu_update: MenuUpdate, current_user: CurrentUser, db: DbSession
) -> RestResponse[None]:
    await menu_service.update_menu(
        menu_update=menu_update, author=current_user.username, db=db
    )
    return RestResponse.of_success(None)


@router.delete(
    "/{menu_id}",
    summary="Delete Menu",
    dependencies=[authorize(PermissionCode.MENU_MANAGEMENT_WRITE)],
)
async def delete_menu(
    menu_id: str, menu_delete: MenuDelete, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await menu_service.delete_menu(
        menu_delete=menu_delete, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)


@router.post(
    "/operation",
    summary="Operate Menus",
    dependencies=[authorize(PermissionCode.MENU_MANAGEMENT_WRITE)],
)
async def operate_menus(
    menu_operate: MenuOperate, current_user: CurrentUser, db: DbSession
) -> RestResponse[bool]:
    await menu_service.operate_menus(
        menu_operate=menu_operate, author=current_user.username, db=db
    )
    return RestResponse.of_success(True)
