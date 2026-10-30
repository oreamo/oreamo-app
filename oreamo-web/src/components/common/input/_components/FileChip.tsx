import { MouseEvent, useState } from "react";

import { Box, styled } from "@mui/material";

import { Chip } from "@/components/common/display/Chip";
import { FileImagePreviewModal } from "@/components/common/input/_components/FileImagePreviewModal";
import { FileGroup, FileInfo } from "@/models/file-model";
import { useFileDelete } from "@/resources/file/useFileDelete";
import { useFileDownload } from "@/resources/file/useFileDownload";

const PREVIEW_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

interface FileChipProps {
  file: FileInfo;
  fileGroupId?: string;
  deletable?: boolean;
  disabled?: boolean;
  onDelete?: (fileGroup: FileGroup) => void;
}

export function FileChip({
  file,
  fileGroupId,
  deletable = false,
  disabled = false,
  onDelete,
}: FileChipProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const { mutate: downloadFile, isPending: isDownloading } = useFileDownload({
    fileId: file.fileId,
  });
  const { mutate: deleteFile, isPending: isDeleting } = useFileDelete({
    fileId: file.fileId,
    fileGroupId,
  });

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();

    downloadFile({ fileName: file.fileName });
  };

  const handleDelete = () => {
    deleteFile(undefined, {
      onSuccess: (response) => {
        if (!response.data.succeed) return;

        onDelete?.(response.data.data);
      },
    });
  };

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handlePreviewContainerClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const isPreviewable = PREVIEW_IMAGE_TYPES.includes(file.fileContentType);

  return (
    <>
      <Chip
        label={file.fileName}
        size="small"
        icon={isPreviewable ? "ImageSearchOutlined" : undefined}
        disabled={disabled || isDownloading || isDeleting}
        onClick={handleClick}
        onIconClick={isPreviewable ? handlePreviewOpen : undefined}
        onDelete={deletable ? handleDelete : undefined}
      />
      {previewOpen && (
        <StyledFileChipPreviewContainer onClick={handlePreviewContainerClick}>
          <FileImagePreviewModal file={file} onClose={handlePreviewClose} />
        </StyledFileChipPreviewContainer>
      )}
    </>
  );
}

const StyledFileChipPreviewContainer = styled(Box)({
  display: "contents",
});
