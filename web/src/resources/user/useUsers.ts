import { Pagination, PageInfo } from "@/models/common-model";
import { User, UserSearch } from "@/models/user-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseUsersOptions {
  userSearchValue: UserSearch;
  userPagination: Pagination;
}

export function useUsers({ userSearchValue, userPagination }: UseUsersOptions) {
  return useFetch<PageInfo<User>>({
    url: "/users",
    params: {
      ...userSearchValue,
      ...userPagination,
    },
  });
}
