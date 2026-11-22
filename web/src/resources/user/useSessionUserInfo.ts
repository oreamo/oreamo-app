import { UserInfo } from "@/models/user-model";
import { useFetch, UseFetchOptions } from "@/resources/_hooks/useFetch";

export function useSessionUserInfo(
  options?: Pick<UseFetchOptions<UserInfo>, "throwOnError">,
) {
  return useFetch<UserInfo>({
    url: "/session/user-info",
    staleTime: Infinity,
    refetchOnMount: false,
    ...options,
  });
}
