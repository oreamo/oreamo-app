import { MenuTreeNode } from "@/models/menu-model";
import { useFetch } from "@/resources/_hooks/useFetch";

export function useMenuTree() {
  return useFetch<MenuTreeNode[]>({
    url: "/menus/tree",
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
