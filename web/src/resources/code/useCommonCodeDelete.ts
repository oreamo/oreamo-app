import { CommonCodeDelete } from "@/models/code-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseCommonCodeDeleteOptions {
  commonCode?: string;
}

export function useCommonCodeDelete({
  commonCode,
}: UseCommonCodeDeleteOptions) {
  return useAction<CommonCodeDelete, boolean>({
    url: `/common-codes/${commonCode}`,
    method: "delete",
    invalidateUrls: ["/common-codes"],
  });
}
