import { FileGroup } from "@/models/file-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseFileGroupOptions {
  fileGroupId?: string;
  enabled?: boolean;
}

export function useFileGroup({
  fileGroupId,
  enabled = true,
}: UseFileGroupOptions) {
  return useFetch<FileGroup>({
    url: `/files/groups/${fileGroupId}`,
    enabled: enabled && !!fileGroupId,
  });
}
