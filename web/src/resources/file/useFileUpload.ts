import { FileGroup } from "@/models/file-model";
import { useAction, UseActionOptions } from "@/resources/_hooks/useAction";

interface UseFileUploadOptions {
  onSuccess?: UseActionOptions<FormData, FileGroup>["onSuccess"];
}

export function useFileUpload({ onSuccess }: UseFileUploadOptions = {}) {
  return useAction<FormData, FileGroup>({
    url: "/files",
    invalidateUrls: ["/files"],
    onSuccess,
  });
}
