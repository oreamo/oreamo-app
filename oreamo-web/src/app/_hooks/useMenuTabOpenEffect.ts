import { useEffect } from "react";

import { useLocation } from "react-router";

import { useMenuMatch } from "@/hooks/useMenuMatch";
import { useMenuTree } from "@/resources/menu/useMenuTree";
import { useMenuTabActions } from "@/stores/menu-tab-store";

interface UseMenuTabOpenEffectOptions {
  enabled: boolean;
}

export function useMenuTabOpenEffect({ enabled }: UseMenuTabOpenEffectOptions) {
  const { pathname } = useLocation();

  const { open } = useMenuTabActions();

  const { data: menuTreeNodes } = useMenuTree();
  const { findCurrentMenu } = useMenuMatch();

  const currentMenu = findCurrentMenu(menuTreeNodes);

  useEffect(() => {
    if (!enabled || !currentMenu) return;

    open({
      menuId: currentMenu.menuId,
      menuName: currentMenu.menuName,
      url: pathname,
    });
  }, [enabled, currentMenu, pathname, open]);
}
