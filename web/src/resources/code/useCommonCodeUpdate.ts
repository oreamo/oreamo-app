import { CommonCode, CommonCodeUpdate } from "@/models/code-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseCommonCodeUpdateOptions {
  commonCode?: string;
}

export function useCommonCodeUpdate({
  commonCode,
}: UseCommonCodeUpdateOptions) {
  return useAction<CommonCodeUpdate, CommonCode>({
    url: `/common-codes/${commonCode}`,
    method: "put",
    invalidateUrls: ["/common-codes"],
  });
}
