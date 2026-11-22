import { Role, RoleSearch } from "@/models/authority-model";
import { PageInfo, Pagination } from "@/models/common-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseRolesOptions {
  roleSearchValue: RoleSearch;
  rolePagination: Pagination;
}

export function useRoles({ roleSearchValue, rolePagination }: UseRolesOptions) {
  return useFetch<PageInfo<Role>>({
    url: "/roles",
    params: {
      ...roleSearchValue,
      ...rolePagination,
    },
  });
}
