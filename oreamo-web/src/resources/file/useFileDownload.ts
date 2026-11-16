import { useDownload } from "@/resources/_hooks/useDownload";

interface UseFileDownloadOptions {
  fileGroupId?: string;
  fileId?: string;
}

export function useFileDownload({
  fileGroupId,
  fileId,
}: UseFileDownloadOptions) {
  return useDownload({
    url: `/files/${fileGroupId}/${fileId}/download`,
  });
}
