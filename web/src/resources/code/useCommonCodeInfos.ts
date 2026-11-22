import { GROUP_CODE } from "@/constants/code-constant";
import { CommonCodeInfo } from "@/models/code-model";
import { useFetch } from "@/resources/_hooks/useFetch";

export type GroupCodeValue = (typeof GROUP_CODE)[keyof typeof GROUP_CODE];

export function useCommonCodeInfos(groupCodes: readonly GroupCodeValue[]) {
  return useFetch<CommonCodeInfo[]>({
    url: "/common-codes/infos",
    params: {
      groupCodes,
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
