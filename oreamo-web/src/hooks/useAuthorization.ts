import { useMenuMatch } from "@/hooks/useMenuMatch";
import { MenuTreeNode } from "@/models/menu-model";
import { useMenuTree } from "@/resources/menu/useMenuTree";
import { useSessionUserInfo } from "@/resources/user/useSessionUserInfo";

export function useAuthorization() {
  const { data: menuTreeNodes, isPending: isMenuTreePending } = useMenuTree();
  const { data: userInfo, isPending: isUserInfoPending } = useSessionUserInfo();
  const { matchedMenuIds } = useMenuMatch();

  const extractMenus = (menuTreeNodes: MenuTreeNode[]): MenuTreeNode[] => {
    return menuTreeNodes.flatMap((menu) => [
      menu,
      ...extractMenus(menu.subMenus ?? []),
    ]);
  };

  const validateAuthorization = (menuId: string) => {
    const menus = extractMenus(menuTreeNodes ?? []);
    return menus.some((menu) => menu.menuId === menuId);
  };

  const hasPermission = (permissionCode: string) => {
    return userInfo?.permissionCodes.includes(permissionCode) ?? false;
  };

  const currentMenuId = matchedMenuIds[matchedMenuIds.length - 1];
  const isAuthorizedMenu = validateAuthorization(currentMenuId);

  return {
    isAuthorizedMenu,
    isReadyToAuthorize: !isMenuTreePending && !isUserInfoPending,
    validateAuthorization,
    hasPermission,
  };
}
