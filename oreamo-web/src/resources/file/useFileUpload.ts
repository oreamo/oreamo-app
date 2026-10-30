import { FileGroup } from "@/models/file-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useFileUpload() {
  return useAction<FormData, FileGroup>({
    url: "/files",
    invalidateUrls: ["/files/groups"],
  });
}
