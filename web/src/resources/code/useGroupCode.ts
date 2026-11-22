import { GroupCode } from "@/models/code-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseGroupCodeOptions {
  groupCode?: string;
}

export function useGroupCode({ groupCode }: UseGroupCodeOptions) {
  return useFetch<GroupCode>({
    url: `/group-codes/${groupCode}`,
    enabled: !!groupCode,
  });
}
