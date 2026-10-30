import { GroupCodeDelete } from "@/models/code-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseGroupCodeDeleteOptions {
  groupCode?: string;
}

export function useGroupCodeDelete({ groupCode }: UseGroupCodeDeleteOptions) {
  return useAction<GroupCodeDelete, boolean>({
    url: `/group-codes/${groupCode}`,
    method: "delete",
    invalidateUrls: ["/group-codes"],
  });
}
