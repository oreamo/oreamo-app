import { PermissionUpdate } from "@/models/authority-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UsePermissionUpdateOptions {
  permissionCode?: string;
}

export function usePermissionUpdate({
  permissionCode,
}: UsePermissionUpdateOptions) {
  return useAction<PermissionUpdate, void>({
    url: `/permissions/${permissionCode}`,
    method: "put",
    invalidateUrls: ["/permissions"],
  });
}
