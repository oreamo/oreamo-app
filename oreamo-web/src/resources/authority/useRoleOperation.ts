import { RoleOperate } from "@/models/authority-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useRoleOperation() {
  return useAction<RoleOperate, boolean>({
    url: "/roles/operation",
    invalidateUrls: ["/roles", "/permissions"],
  });
}
