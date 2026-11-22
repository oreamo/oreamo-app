import { RoleInfo } from "@/models/authority-model";
import { useFetch } from "@/resources/_hooks/useFetch";

export function useRoleInfos() {
  return useFetch<RoleInfo[]>({
    url: "/roles/infos",
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
