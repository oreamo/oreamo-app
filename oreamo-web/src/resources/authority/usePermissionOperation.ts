import { PermissionOperate } from "@/models/authority-model";
import { useAction } from "@/resources/_hooks/useAction";

export function usePermissionOperation() {
  return useAction<PermissionOperate, boolean>({
    url: "/permissions/operation",
    invalidateUrls: ["/permissions", "/roles"],
  });
}
