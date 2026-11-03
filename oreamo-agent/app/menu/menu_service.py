from sqlalchemy import delete, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.authority import permission_service
from app.authority.permission_schema import PermissionsSearch
from app.common.enums import DataStatus
from app.common.exception import RestException
from app.common.pagination import paginate
from app.common.schema import PageResponse
from app.common.translation_key import TranslationKey
from app.menu.menu_model import MenuEntity
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


async def get_menus(
    *, menus_search: MenusSearch, db: AsyncSession
) -> PageResponse[Menu]:
    query = select(MenuEntity).distinct()
    if menus_search.menu_id:
        query = query.where(MenuEntity.menu_id == menus_search.menu_id)
    if menus_search.menu_ids:
        query = query.where(MenuEntity.menu_id.in_(menus_search.menu_ids))
    if menus_search.parent_menu_id:
        query = query.where(MenuEntity.parent_menu_id == menus_search.parent_menu_id)
    if menus_search.menu_name:
        query = query.where(MenuEntity.menu_name.contains(menus_search.menu_name))
    if menus_search.menu_type:
        query = query.where(MenuEntity.menu_type == menus_search.menu_type)
    if menus_search.data_status:
        query = query.where(MenuEntity.data_status == menus_search.data_status)
    query = query.order_by(MenuEntity.sort_order)

    return await paginate(query=query, pagination=menus_search, schema=Menu, db=db)


async def get_menu(*, menu_search: MenuSearch, db: AsyncSession) -> Menu:
    menu = await _select_menu(menu_search=menu_search, db=db)
    if menu is None:
        raise RestException(
            TranslationKey.Common.Message.NOT_FOUND_FAILURE,
            TranslationKey.Menu.Label.MENU,
        )
    return menu


async def get_menu_tree(*, role_code: str, db: AsyncSession) -> list[MenuTreeNode]:
    permissions = await permission_service.get_permissions(
        permissions_search=PermissionsSearch.of_enabled_role_code(role_code), db=db
    )
    permission_codes = [permission.permission_code for permission in permissions.items]
    if not permission_codes:
        return []

    menus = await _select_menu_tree_nodes(permission_codes=permission_codes, db=db)
    menu_by_menu_id = {menu.menu_id: menu for menu in menus}

    roots: list[MenuTreeNode] = []
    for menu in menus:
        if menu.parent_menu_id is None:
            roots.append(menu)
            continue

        parent = menu_by_menu_id.get(menu.parent_menu_id)
        if parent is not None:
            if parent.sub_menus is None:
                parent.sub_menus = []
            parent.sub_menus.append(menu)

    return roots


async def save_menu(*, menu_save: MenuSave, author: str, db: AsyncSession) -> Menu:
    menu_search = MenuSearch.of_menu_id(menu_save.menu_id)
    if await _select_menu(menu_search=menu_search, db=db) is not None:
        raise RestException(
            TranslationKey.Common.Message.DUPLICATE_FAILURE,
            TranslationKey.Menu.Label.MENU,
            menu_save.menu_id,
        )

    result = await db.execute(
        insert(MenuEntity).values(
            menu_id=menu_save.menu_id,
            menu_name=menu_save.menu_name,
            menu_type=menu_save.menu_type,
            url=menu_save.url,
            parent_menu_id=menu_save.parent_menu_id,
            menu_permission_code=menu_save.menu_permission_code or None,
            sort_order=menu_save.sort_order,
            data_status=menu_save.data_status,
            created_by=author,
            updated_by=author,
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)

    menu = await _select_menu(menu_search=menu_search, db=db)
    if menu is None:
        raise RestException(TranslationKey.Common.Message.CREATE_FAILURE)
    return menu


async def update_menu(
    *, menu_update: MenuUpdate, author: str, db: AsyncSession
) -> None:
    await get_menu(menu_search=MenuSearch.of_menu_id(menu_update.menu_id), db=db)

    result = await db.execute(
        update(MenuEntity)
        .where(MenuEntity.menu_id == menu_update.menu_id)
        .values(
            menu_name=menu_update.menu_name,
            menu_permission_code=menu_update.menu_permission_code or None,
            data_status=menu_update.data_status,
            updated_by=author,
            updated_at=func.now(),
        )
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.UPDATE_FAILURE)


async def delete_menu(
    *, menu_delete: MenuDelete, author: str, db: AsyncSession
) -> None:
    await get_menu(menu_search=MenuSearch.of_menu_id(menu_delete.menu_id), db=db)

    sub_menus = await get_menus(
        menus_search=MenusSearch.of_parent_menu_id(menu_delete.menu_id), db=db
    )
    if sub_menus.items:
        raise RestException(TranslationKey.Menu.Message.MENU_DELETE_FAILURE_BY_SUB_MENU)

    result = await db.execute(
        delete(MenuEntity).where(MenuEntity.menu_id == menu_delete.menu_id)
    )
    if result.rowcount == 0:
        raise RestException(TranslationKey.Common.Message.DELETE_FAILURE)


async def operate_menus(
    *, menu_operate: MenuOperate, author: str, db: AsyncSession
) -> None:
    if menu_operate.menu_deletes:
        delete_menus = await get_menus(
            menus_search=MenusSearch.of_menu_ids(menu_operate.get_delete_menu_ids()),
            db=db,
        )
        parent_menu_ids_of_delete_menus = {
            menu.menu_id: menu.parent_menu_id for menu in delete_menus.items
        }
        for menu_delete in menu_operate.get_menu_deletes_sorted_by_hierarchy(
            parent_menu_ids_of_delete_menus
        ):
            await delete_menu(menu_delete=menu_delete, author=author, db=db)

    for menu_update in menu_operate.menu_updates or []:
        await update_menu(menu_update=menu_update, author=author, db=db)

    for menu_save in menu_operate.get_menu_saves_sorted_by_hierarchy():
        await save_menu(menu_save=menu_save, author=author, db=db)


async def _select_menu(*, menu_search: MenuSearch, db: AsyncSession) -> Menu | None:
    query = select(MenuEntity)
    if menu_search.menu_id:
        query = query.where(MenuEntity.menu_id == menu_search.menu_id)
    if menu_search.data_status:
        query = query.where(MenuEntity.data_status == menu_search.data_status)

    entity = (await db.execute(query)).scalar_one_or_none()
    return Menu.model_validate(entity) if entity is not None else None


async def _select_menu_tree_nodes(
    *, permission_codes: list[str], db: AsyncSession
) -> list[MenuTreeNode]:
    # Permitted menus and all of their ancestors
    menu_tree_node = (
        select(
            MenuEntity.menu_id.label("menu_id"),
            MenuEntity.menu_name.label("menu_name"),
            MenuEntity.menu_type.label("menu_type"),
            MenuEntity.url.label("url"),
            MenuEntity.parent_menu_id.label("parent_menu_id"),
            MenuEntity.sort_order.label("sort_order"),
        )
        .where(
            MenuEntity.menu_permission_code.in_(permission_codes),
            MenuEntity.data_status == DataStatus.ENABLED,
        )
        .cte("MENU_TREE_NODE", recursive=True)
    )
    child_menu = menu_tree_node.alias("C")
    parent_menu = aliased(MenuEntity, name="P")
    menu_tree_node = menu_tree_node.union(
        select(
            parent_menu.menu_id,
            parent_menu.menu_name,
            parent_menu.menu_type,
            parent_menu.url,
            parent_menu.parent_menu_id,
            parent_menu.sort_order,
        )
        .join(child_menu, parent_menu.menu_id == child_menu.c.parent_menu_id)
        .where(parent_menu.data_status == DataStatus.ENABLED)
    )

    result = await db.execute(
        select(menu_tree_node).distinct().order_by(menu_tree_node.c.sort_order)
    )
    return [MenuTreeNode.model_validate(row) for row in result.mappings()]
