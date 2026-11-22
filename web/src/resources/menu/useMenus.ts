import { Pagination, PageInfo } from "@/models/common-model";
import { Menu, MenuSearch } from "@/models/menu-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseMenusOptions {
  menuSearchValue: MenuSearch;
  menuPagination: Pagination;
}

export function useMenus({ menuSearchValue, menuPagination }: UseMenusOptions) {
  return useFetch<PageInfo<Menu>>({
    url: "/menus",
    params: {
      ...menuSearchValue,
      ...menuPagination,
    },
  });
}
