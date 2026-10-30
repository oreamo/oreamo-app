import { Link } from "@mui/material";

import { FileInfo } from "@/models/file-model";
import { useFileDownload } from "@/resources/file/useFileDownload";

interface FileLinkProps {
  file: FileInfo;
}

export function FileLink({ file }: FileLinkProps) {
  const { mutate: downloadFile } = useFileDownload({
    fileId: file.fileId,
  });

  const handleClick = () => {
    downloadFile({ fileName: file.fileName });
  };

  return (
    <Link
      component="button"
      type="button"
      variant="body2"
      underline="hover"
      noWrap
      onClick={handleClick}
    >
      {file.fileName}
    </Link>
  );
}
