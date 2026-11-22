import { PermissionDelete } from "@/models/authority-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UsePermissionDeleteOptions {
  permissionCode?: string;
}

export function usePermissionDelete({
  permissionCode,
}: UsePermissionDeleteOptions) {
  return useAction<PermissionDelete, boolean>({
    url: `/permissions/${permissionCode}`,
    method: "delete",
    invalidateUrls: ["/permissions", "/roles"],
  });
}
