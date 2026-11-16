import { useSearchPagination } from "@/hooks/useSearchPagination";
import { MenuSearch } from "@/models/menu-model";
import { PageLayout } from "@/pages/_components/PageLayout";
import { MenuGrid } from "@/pages/setting/system/menu-management/_components/MenuGrid";
import { MenuSearchForm } from "@/pages/setting/system/menu-management/_components/MenuSearchForm";
import { useMenus } from "@/resources/menu/useMenus";

export function MenuManagementPage() {
  const {
    searchValue: menuSearchValue,
    pagination: menuPagination,
    handleSearchValueChange: handleMenuSearchValueChange,
    handlePageChange,
  } = useSearchPagination<MenuSearch>({
    defaultPageSize: 10,
  });

  const { data: menusPageInfo, fetch: fetchMenus } = useMenus({
    menuSearchValue,
    menuPagination,
  });

  const handleRefresh = () => {
    fetchMenus();
  };

  return (
    <PageLayout>
      <MenuSearchForm
        onSearch={handleMenuSearchValueChange}
        onRefresh={handleRefresh}
      />
      <MenuGrid
        rowData={menusPageInfo?.list}
        pageInfo={menusPageInfo}
        onPaginationChange={handlePageChange}
      />
    </PageLayout>
  );
}
