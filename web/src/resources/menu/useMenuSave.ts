import { Menu, MenuSave } from "@/models/menu-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useMenuSave() {
  return useAction<MenuSave, Menu>({
    url: "/menus",
    method: "post",
  });
}
