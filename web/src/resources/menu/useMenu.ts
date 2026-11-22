import { Menu } from "@/models/menu-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseMenuOptions {
  menuId?: string;
}

export function useMenu({ menuId }: UseMenuOptions) {
  return useFetch<Menu>({
    url: `/menus/${menuId}`,
    enabled: !!menuId,
  });
}
