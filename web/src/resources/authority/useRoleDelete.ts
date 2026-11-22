import { RoleDelete } from "@/models/authority-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseRoleDeleteOptions {
  roleCode?: string;
}

export function useRoleDelete({ roleCode }: UseRoleDeleteOptions) {
  return useAction<RoleDelete, boolean>({
    url: `/roles/${roleCode}`,
    method: "delete",
    invalidateUrls: ["/roles", "/permissions"],
  });
}
