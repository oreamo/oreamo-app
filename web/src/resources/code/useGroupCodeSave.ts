import { GroupCode, GroupCodeSave } from "@/models/code-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useGroupCodeSave() {
  return useAction<GroupCodeSave, GroupCode>({
    url: "/group-codes",
    method: "post",
  });
}
