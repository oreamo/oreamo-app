import { PermissionInfo } from "@/models/authority-model";
import { useFetch } from "@/resources/_hooks/useFetch";

export function usePermissionInfos() {
  return useFetch<PermissionInfo[]>({
    url: "/permissions/infos",
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
