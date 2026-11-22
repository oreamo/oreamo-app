import { CommonCodeOperate } from "@/models/code-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useCommonCodeOperation() {
  return useAction<CommonCodeOperate, boolean>({
    url: "/common-codes/operation",
    invalidateUrls: ["/common-codes"],
  });
}
