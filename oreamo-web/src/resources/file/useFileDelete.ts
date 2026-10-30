import { FileGroup } from "@/models/file-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseFileDeleteOptions {
  fileId?: string;
  fileGroupId?: string;
}

export function useFileDelete({ fileId, fileGroupId }: UseFileDeleteOptions) {
  return useAction<void, FileGroup>({
    url: `/files/${fileId}`,
    method: "delete",
    invalidateUrls: [`/files/groups/${fileGroupId}`],
  });
}
