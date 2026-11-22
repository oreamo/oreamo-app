import { useState } from "react";

import { styled } from "@mui/material";
import { Accept } from "react-dropzone";

import { IconButton } from "@/components/common/button/IconButton";
import { Chip } from "@/components/common/display/Chip";
import { Text } from "@/components/common/display/Text";
import { FileDropzone } from "@/components/common/input/_components/FileDropzone";
import { FileLink } from "@/components/common/input/_components/FileLink";
import { Flex } from "@/components/common/layout/Flex";
import { Modal } from "@/components/common/overlay/Modal";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { useFileGroup } from "@/resources/file/useFileGroup";
import { useFileUpload } from "@/resources/file/useFileUpload";

interface FileModalProps {
  title: string;
  fileGroupId?: string;
  accept?: Accept;
  multiple?: boolean;
  onConfirm: (fileGroupId?: string) => void;
  onCancel: () => void;
}

export function FileModal({
  title,
  fileGroupId,
  accept,
  multiple = true,
  onConfirm,
  onCancel,
}: FileModalProps) {
  const { translate } = useTranslate();

  const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);
  const [addedFiles, setAddedFiles] = useState<File[]>([]);

  const { data: fileGroup } = useFileGroup({ fileGroupId });
  const { mutate: uploadFiles, isPending } = useFileUpload();

  const existingFiles = fileGroup?.files ?? [];
  const isEmptyFileGroup = fileGroup?.files.length === 0;
  const isChanged = removedFileIds.length > 0 || addedFiles.length > 0;

  const upload = () => {
    const formData = new FormData();
    if (fileGroupId && !isEmptyFileGroup) {
      formData.append("fileGroupId", fileGroupId);
    }
    addedFiles.forEach((file) => {
      formData.append("uploadFiles", file);
    });
    removedFileIds.forEach((fileId) => {
      formData.append("deleteFileIds", fileId);
    });

    uploadFiles(formData, {
      onSuccess: (response) => {
        if (!response.data.succeed) return;

        const nextFileGroup = response.data.data;
        onConfirm(
          nextFileGroup.files.length > 0
            ? nextFileGroup.fileGroupId
            : undefined,
        );
      },
    });
  };

  const isRemovedFile = (fileId: string) => {
    return removedFileIds.includes(fileId);
  };

  const isDuplicatedFile = (file: File) => {
    return (
      existingFiles.some(
        (fileInfo) =>
          fileInfo.fileName === file.name && fileInfo.fileSize === file.size,
      ) ||
      addedFiles.some(
        (addedFile) =>
          addedFile.name === file.name && addedFile.size === file.size,
      )
    );
  };

  const addFiles = (files: File[]) => {
    const nextFiles = files.filter((file) => !isDuplicatedFile(file));

    if (nextFiles.length === 0) return;

    if (!multiple) {
      setAddedFiles(nextFiles.slice(0, 1));
      setRemovedFileIds(existingFiles.map((file) => file.fileId));
      return;
    }

    setAddedFiles((prev) => [...prev, ...nextFiles]);
  };

  const handleExistingFileToggle = (fileId: string) => {
    if (!multiple && isRemovedFile(fileId)) {
      setAddedFiles([]);
      setRemovedFileIds(
        existingFiles
          .filter((file) => file.fileId !== fileId)
          .map((file) => file.fileId),
      );
      return;
    }

    setRemovedFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((removedFileId) => removedFileId !== fileId)
        : [...prev, fileId],
    );
  };

  const handleAddedFileRemove = (index: number) => {
    setAddedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (!isChanged) {
      onConfirm(fileGroupId);
      return;
    }

    upload();
  };

  return (
    <Modal
      open
      title={title}
      size="small"
      actions={[
        {
          label: translate(TRANSLATION_KEY.common.label.CANCEL),
          variant: "outlined",
          disabled: isPending,
          onClick: onCancel,
        },
        {
          label: translate(TRANSLATION_KEY.common.label.CONFIRM),
          variant: "contained",
          loading: isPending,
          onClick: handleConfirm,
        },
      ]}
      onClose={onCancel}
    >
      <Flex direction="column" gap={1}>
        <FileDropzone
          accept={accept}
          multiple={multiple}
          disabled={isPending}
          onDrop={addFiles}
        />
        <Flex direction="column" gap={0.5}>
          {existingFiles.map((file) => (
            <StyledFileModalGroup
              key={file.fileId}
              gap={1}
              align="center"
              justify="between"
              removed={isRemovedFile(file.fileId)}
            >
              <FileLink file={file} />
              <IconButton
                iconName={isRemovedFile(file.fileId) ? "Undo" : "Close"}
                size="small"
                disabled={isPending}
                onClick={() => handleExistingFileToggle(file.fileId)}
              />
            </StyledFileModalGroup>
          ))}
          {addedFiles.map((file, index) => (
            <StyledFileModalGroup
              key={`added-file-${index}`}
              gap={1}
              align="center"
              justify="between"
            >
              <StyledFileModalItem gap={1} align="center">
                <Text size="sm" ellipsis>
                  {file.name}
                </Text>
                <Chip
                  label={
                    <Text size="xs" color="inherit">
                      {translate(TRANSLATION_KEY.common.label.NEW)}
                    </Text>
                  }
                  size="small"
                  color="primary"
                />
              </StyledFileModalItem>
              <IconButton
                iconName="Close"
                size="small"
                disabled={isPending}
                onClick={() => handleAddedFileRemove(index)}
              />
            </StyledFileModalGroup>
          ))}
        </Flex>
      </Flex>
    </Modal>
  );
}

const StyledFileModalGroup = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "removed",
})<{ removed?: boolean }>(({ theme, removed }) => ({
  minWidth: 0,

  padding: theme.spacing(0.5, 1),

  opacity: removed ? 0.4 : 1,
}));

const StyledFileModalItem = styled(Flex)(({ theme }) => ({
  minWidth: 0,

  "& .MuiChip-root": {
    height: 18,
    flexShrink: 0,
  },

  "& .MuiChip-label": {
    padding: theme.spacing(0, 0.75),
  },
}));
