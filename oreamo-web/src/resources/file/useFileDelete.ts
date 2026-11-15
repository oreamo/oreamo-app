import { FileGroup } from "@/models/file-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseFileDeleteOptions {
  fileGroupId?: string;
  fileId?: string;
}

export function useFileDelete({ fileGroupId, fileId }: UseFileDeleteOptions) {
  return useAction<void, FileGroup>({
    url: `/files/${fileGroupId}/${fileId}`,
    method: "delete",
    invalidateUrls: [`/files/${fileGroupId}`],
  });
}
