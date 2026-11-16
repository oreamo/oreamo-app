import { CommonCode, CommonCodeSave } from "@/models/code-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useCommonCodeSave() {
  return useAction<CommonCodeSave, CommonCode>({
    url: "/common-codes",
    method: "post",
  });
}
