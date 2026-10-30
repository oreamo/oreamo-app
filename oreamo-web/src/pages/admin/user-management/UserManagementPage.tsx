import { useSearchPagination } from "@/hooks/useSearchPagination";
import { UserSearch } from "@/models/user-model";
import { PageLayout } from "@/pages/_components/PageLayout";
import { UserGrid } from "@/pages/admin/user-management/_components/UserGrid";
import { UserSearchForm } from "@/pages/admin/user-management/_components/UserSearchForm";
import { useUsers } from "@/resources/user/useUsers";

export function UserManagementPage() {
  const {
    searchValue: userSearchValue,
    pagination: userPagination,
    handleSearchValueChange: handleUserSearchValueChange,
    handlePageChange: handleUserPageChange,
  } = useSearchPagination<UserSearch>({
    username: "",
    defaultPageSize: 10,
  });

  const { data: usersPageInfo, fetch: fetchUsers } = useUsers({
    userSearchValue,
    userPagination,
  });

  const handleRefresh = () => {
    fetchUsers();
  };

  return (
    <PageLayout>
      <UserSearchForm
        onSearch={handleUserSearchValueChange}
        onRefresh={handleRefresh}
      />
      <UserGrid
        rowData={usersPageInfo?.list}
        pageInfo={usersPageInfo}
        onPaginationChange={handleUserPageChange}
      />
    </PageLayout>
  );
}
