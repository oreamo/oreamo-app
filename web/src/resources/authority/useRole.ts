import { Role } from "@/models/authority-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseRoleOptions {
  roleCode?: string;
}

export function useRole({ roleCode }: UseRoleOptions) {
  return useFetch<Role>({
    url: `/roles/${roleCode}`,
    enabled: !!roleCode,
  });
}
