import { useSearchPagination } from "@/hooks/useSearchPagination";
import { PermissionSearch, Role, RoleSearch } from "@/models/authority-model";
import { PageLayout } from "@/pages/_components/PageLayout";
import { PermissionGrid } from "@/pages/setting/system/authority-management/_components/PermissionGrid";
import { RoleGrid } from "@/pages/setting/system/authority-management/_components/RoleGrid";
import { RoleSearchForm } from "@/pages/setting/system/authority-management/_components/RoleSearchForm";
import { usePermissions } from "@/resources/authority/usePermissions";
import { useRoles } from "@/resources/authority/useRoles";

export function AuthorityManagementPage() {
  const {
    searchValue: roleSearchValue,
    pagination: rolePagination,
    handleSearchValueChange: handleRoleSearchValueChange,
    handlePageChange: handleRolePageChange,
  } = useSearchPagination<RoleSearch>({
    roleName: "",
    defaultPageSize: 10,
  });

  const {
    searchValue: permissionSearchValue,
    pagination: permissionPagination,
    handleSearchValueChange: handlePermissionSearchValueChange,
    handlePageChange: handlePermissionPageChange,
  } = useSearchPagination<PermissionSearch>();

  const { data: rolesPageInfo, fetch: fetchRoles } = useRoles({
    roleSearchValue,
    rolePagination,
  });

  const { data: permissionsPageInfo } = usePermissions({
    permissionSearchValue,
    permissionPagination,
  });

  const handleRoleRefresh = () => {
    fetchRoles();
  };

  const handleRoleSelected = (role: Role) => {
    handlePermissionSearchValueChange({ roleCode: role.roleCode });
  };

  return (
    <PageLayout>
      <RoleSearchForm
        onSearch={handleRoleSearchValueChange}
        onRefresh={handleRoleRefresh}
      />
      <RoleGrid
        rowData={rolesPageInfo?.list}
        pageInfo={rolesPageInfo}
        onRoleSelected={handleRoleSelected}
        onPaginationChange={handleRolePageChange}
      />
      <PermissionGrid
        rowData={permissionsPageInfo?.list}
        pageInfo={permissionsPageInfo}
        onPaginationChange={handlePermissionPageChange}
      />
    </PageLayout>
  );
}
