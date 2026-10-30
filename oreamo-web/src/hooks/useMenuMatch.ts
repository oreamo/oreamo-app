import { useMatches } from "react-router";

import { MenuTreeNode } from "@/models/menu-model";

export function useMenuMatch() {
  const matches = useMatches();

  const matchedMenuIds = matches.map((match) => String(match.id));

  const isMenuActive = (menu: MenuTreeNode): boolean => {
    return (
      matchedMenuIds.includes(menu.menuId) ||
      (menu.subMenus?.some(isMenuActive) ?? false)
    );
  };

  const findCurrentMenu = (
    menus?: MenuTreeNode[],
  ): MenuTreeNode | undefined => {
    const activeMenu = menus?.find(isMenuActive);
    if (!activeMenu) return undefined;

    return findCurrentMenu(activeMenu.subMenus) ?? activeMenu;
  };

  const findCurrentMenuPath = (menus?: MenuTreeNode[]): MenuTreeNode[] => {
    const activeMenu = menus?.find(isMenuActive);
    if (!activeMenu) return [];

    return [activeMenu, ...findCurrentMenuPath(activeMenu.subMenus)];
  };

  return {
    matchedMenuIds,
    isMenuActive,
    findCurrentMenu,
    findCurrentMenuPath,
  };
}
