import { GroupCodeOperate } from "@/models/code-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useGroupCodeOperation() {
  return useAction<GroupCodeOperate, boolean>({
    url: "/group-codes/operation",
    invalidateUrls: ["/group-codes"],
  });
}
