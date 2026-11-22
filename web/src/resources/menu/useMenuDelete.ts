import { MenuDelete } from "@/models/menu-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseMenuDeleteOptions {
  menuId?: string;
}

export function useMenuDelete({ menuId }: UseMenuDeleteOptions) {
  return useAction<MenuDelete, boolean>({
    url: `/menus/${menuId}`,
    method: "delete",
    invalidateUrls: ["/menus"],
  });
}
