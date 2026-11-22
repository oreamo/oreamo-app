import { MenuOperate } from "@/models/menu-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useMenuOperation() {
  return useAction<MenuOperate, boolean>({
    url: "/menus/operation",
    invalidateUrls: ["/menus"],
  });
}
