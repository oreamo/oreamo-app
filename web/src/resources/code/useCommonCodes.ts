import { CommonCode, CommonCodeSearch } from "@/models/code-model";
import { Pagination, PageInfo } from "@/models/common-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseCommonCodesOptions {
  commonCodeSearchValue: CommonCodeSearch;
  commonCodePagination: Pagination;
  enabled?: boolean;
}

export function useCommonCodes({
  commonCodeSearchValue,
  commonCodePagination,
  enabled = true,
}: UseCommonCodesOptions) {
  return useFetch<PageInfo<CommonCode>>({
    url: "/common-codes",
    params: {
      ...commonCodeSearchValue,
      ...commonCodePagination,
    },
    enabled,
  });
}
