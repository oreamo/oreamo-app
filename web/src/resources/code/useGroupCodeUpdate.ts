import { GroupCode, GroupCodeUpdate } from "@/models/code-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseGroupCodeUpdateOptions {
  groupCode?: string;
}

export function useGroupCodeUpdate({ groupCode }: UseGroupCodeUpdateOptions) {
  return useAction<GroupCodeUpdate, GroupCode>({
    url: `/group-codes/${groupCode}`,
    method: "put",
    invalidateUrls: ["/group-codes"],
  });
}
