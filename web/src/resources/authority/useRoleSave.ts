import { Role, RoleSave } from "@/models/authority-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useRoleSave() {
  return useAction<RoleSave, Role>({
    url: "/roles",
    method: "post",
    invalidateUrls: ["/roles", "/permissions"],
  });
}
