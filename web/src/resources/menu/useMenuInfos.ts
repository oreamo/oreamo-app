import { MenuInfo } from "@/models/menu-model";
import { useFetch } from "@/resources/_hooks/useFetch";

export function useMenuInfos() {
  return useFetch<MenuInfo[]>({
    url: "/menus/infos",
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
