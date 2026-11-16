import { RoleUpdate } from "@/models/authority-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseRoleUpdateOptions {
  roleCode?: string;
}

export function useRoleUpdate({ roleCode }: UseRoleUpdateOptions) {
  return useAction<RoleUpdate, void>({
    url: `/roles/${roleCode}`,
    method: "put",
    invalidateUrls: ["/roles", "/permissions"],
  });
}
