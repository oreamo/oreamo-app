import { usePagination } from "@/hooks/usePagination";
import { useSearch } from "@/hooks/useSearch";

type UseSearchPaginationOptions<TSearch extends {}> = TSearch & {
  defaultPageNum?: number;
  defaultPageSize?: number;
};

export function useSearchPagination<TSearch extends {} = {}>(
  options?: UseSearchPaginationOptions<TSearch>,
) {
  const { defaultPageNum, defaultPageSize, ...defaultSearchValue } = (options ??
    {}) as UseSearchPaginationOptions<TSearch>;

  const { searchValue, handleSearchValueChange: setSearchValue } =
    useSearch<TSearch>(defaultSearchValue as TSearch);

  const { pagination, handlePageChange, handlePageSizeChange, resetPage } =
    usePagination({ defaultPageNum, defaultPageSize });

  const handleSearchValueChange = (changedSearchValue: Partial<TSearch>) => {
    setSearchValue(changedSearchValue);
    resetPage();
  };

  return {
    searchValue,
    defaultSearchValue,
    pagination,
    handleSearchValueChange,
    handlePageChange,
    handlePageSizeChange,
  };
}
