import { Permission } from "@/models/authority-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UsePermissionOptions {
  permissionCode?: string;
}

export function usePermission({ permissionCode }: UsePermissionOptions) {
  return useFetch<Permission>({
    url: `/permissions/${permissionCode}`,
    enabled: !!permissionCode,
  });
}
