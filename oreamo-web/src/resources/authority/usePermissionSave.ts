import { Permission, PermissionSave } from "@/models/authority-model";
import { useAction } from "@/resources/_hooks/useAction";

export function usePermissionSave() {
  return useAction<PermissionSave, Permission>({
    url: "/permissions",
    method: "post",
  });
}
