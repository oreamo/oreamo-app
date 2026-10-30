import { useSearchPagination } from "@/hooks/useSearchPagination";
import {
  CommonCodeSearch,
  GroupCode,
  GroupCodeSearch,
} from "@/models/code-model";
import { PageLayout } from "@/pages/_components/PageLayout";
import { CodeSearchForm } from "@/pages/admin/code-management/_components/CodeSearchForm";
import { CommonCodeGrid } from "@/pages/admin/code-management/_components/CommonCodeGrid";
import { GroupCodeGrid } from "@/pages/admin/code-management/_components/GroupCodeGrid";
import { useCommonCodes } from "@/resources/code/useCommonCodes";
import { useGroupCodes } from "@/resources/code/useGroupCodes";

export function CodeManagementPage() {
  const {
    searchValue: groupCodeSearchValue,
    pagination: groupCodePagination,
    handleSearchValueChange: handleGroupCodeSearchValueChange,
    handlePageChange: handleGroupCodePageChange,
  } = useSearchPagination<GroupCodeSearch>();

  const {
    searchValue: commonCodeSearchValue,
    pagination: commonCodePagination,
    handleSearchValueChange: handleCommonCodeSearchValueChange,
    handlePageChange: handleCommonCodePageChange,
  } = useSearchPagination<CommonCodeSearch>();

  const { data: groupCodesPageInfo, fetch: fetchGroupCodes } = useGroupCodes({
    groupCodeSearchValue,
    groupCodePagination,
  });

  const { data: commonCodesPageInfo } = useCommonCodes({
    commonCodeSearchValue,
    commonCodePagination,
    enabled: !!commonCodeSearchValue.groupCode,
  });

  const handleRefresh = () => {
    fetchGroupCodes();
  };

  const handleGroupCodeSelected = (groupCode: GroupCode) => {
    handleCommonCodeSearchValueChange({ groupCode: groupCode.groupCode });
  };

  return (
    <PageLayout>
      <CodeSearchForm
        onSearch={handleGroupCodeSearchValueChange}
        onRefresh={handleRefresh}
      />
      <GroupCodeGrid
        rowData={groupCodesPageInfo?.list}
        pageInfo={groupCodesPageInfo}
        onGroupCodeSelected={handleGroupCodeSelected}
        onPaginationChange={handleGroupCodePageChange}
      />
      {commonCodeSearchValue.groupCode && (
        <CommonCodeGrid
          groupCode={commonCodeSearchValue.groupCode}
          rowData={commonCodesPageInfo?.list}
          pageInfo={commonCodesPageInfo}
          onPaginationChange={handleCommonCodePageChange}
        />
      )}
    </PageLayout>
  );
}
