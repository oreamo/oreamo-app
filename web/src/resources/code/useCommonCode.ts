import { CommonCode } from "@/models/code-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseCommonCodeOptions {
  groupCode?: string;
  commonCode?: string;
}

export function useCommonCode({ groupCode, commonCode }: UseCommonCodeOptions) {
  return useFetch<CommonCode>({
    url: `/common-codes/${commonCode}`,
    params: {
      groupCode,
    },
    enabled: !!groupCode && !!commonCode,
  });
}
