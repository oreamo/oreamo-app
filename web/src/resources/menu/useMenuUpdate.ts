import { MenuUpdate } from "@/models/menu-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseMenuUpdateOptions {
  menuId?: string;
}

export function useMenuUpdate({ menuId }: UseMenuUpdateOptions) {
  return useAction<MenuUpdate, void>({
    url: `/menus/${menuId}`,
    method: "put",
    invalidateUrls: ["/menus"],
  });
}
