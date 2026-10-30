import { useDownload } from "@/resources/_hooks/useDownload";

interface UseFileDownloadOptions {
  fileId?: string;
}

export function useFileDownload({ fileId }: UseFileDownloadOptions) {
  return useDownload({
    url: `/files/${fileId}/download`,
  });
}
