import { GroupCode, GroupCodeSearch } from "@/models/code-model";
import { Pagination, PageInfo } from "@/models/common-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseGroupCodesOptions {
  groupCodeSearchValue: GroupCodeSearch;
  groupCodePagination: Pagination;
}

export function useGroupCodes({
  groupCodeSearchValue,
  groupCodePagination,
}: UseGroupCodesOptions) {
  return useFetch<PageInfo<GroupCode>>({
    url: "/group-codes",
    params: {
      ...groupCodeSearchValue,
      ...groupCodePagination,
    },
  });
}
