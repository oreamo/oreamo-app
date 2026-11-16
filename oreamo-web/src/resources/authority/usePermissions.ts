import { Permission, PermissionSearch } from "@/models/authority-model";
import { PageInfo, Pagination } from "@/models/common-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UsePermissionsOptions {
  permissionSearchValue: PermissionSearch;
  permissionPagination: Pagination;
  enabled?: boolean;
}

export function usePermissions({
  permissionSearchValue,
  permissionPagination,
  enabled = true,
}: UsePermissionsOptions) {
  return useFetch<PageInfo<Permission>>({
    url: "/permissions",
    params: {
      ...permissionSearchValue,
      ...permissionPagination,
    },
    enabled,
  });
}
