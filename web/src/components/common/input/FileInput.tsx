import { Ref, useState } from "react";

import { InputAdornment, alpha, styled } from "@mui/material";
import { Accept } from "react-dropzone";

import { IconButton } from "@/components/common/button/IconButton";
import { FileChip } from "@/components/common/input/_components/FileChip";
import { FileModal } from "@/components/common/input/_components/FileModal";
import { useScrollFadeEffect } from "@/components/common/input/_hooks/useScrollFadeEffect";
import { TextInput } from "@/components/common/input/TextInput";
import { Flex } from "@/components/common/layout/Flex";
import { FileGroup } from "@/models/file-model";
import { useFileGroup } from "@/resources/file/useFileGroup";

export interface FileInputProps {
  ref?: Ref<HTMLInputElement>;
  value?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  readonly?: boolean;
  disabled?: boolean;
  error?: boolean;
  accept?: Accept;
  multiple?: boolean;
  onChange?: (value?: string) => void;
}

export function FileInput({
  ref,
  value,
  label,
  placeholder,
  helperText,
  readonly,
  disabled,
  error,
  accept,
  multiple = true,
  onChange,
}: FileInputProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: fileGroup } = useFileGroup({ fileGroupId: value });

  const files = fileGroup?.files ?? [];

  const { scrollFadeRef } = useScrollFadeEffect<HTMLDivElement>({
    value: fileGroup?.files,
  });

  const handleAttachClick = () => {
    setDialogOpen(true);
  };

  const handleInputClick = () => {
    if (disabled || readonly) return;

    setDialogOpen(true);
  };

  const handleDialogConfirm = (nextValue?: string) => {
    onChange?.(nextValue);
    setDialogOpen(false);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const handleFileDelete = (nextFileGroup: FileGroup) => {
    if (nextFileGroup.files.length > 0) return;

    onChange?.(undefined);
  };

  const hasChips = files.length > 0;

  return (
    <StyledFileInputContainer direction="column" hasChips={hasChips}>
      <TextInput
        ref={ref}
        label={label}
        placeholder={hasChips ? undefined : placeholder}
        helperText={helperText}
        readonly={readonly}
        disableEditing
        disabled={disabled}
        error={error}
        startAdornment={
          hasChips && (
            <StyledFileInputWrapper
              ref={scrollFadeRef}
              gap={0.5}
              align="center"
              grow
            >
              {files.map((file) => (
                <FileChip
                  key={file.fileId}
                  file={file}
                  fileGroupId={value}
                  deletable={!readonly && !disabled}
                  disabled={disabled}
                  onDelete={handleFileDelete}
                />
              ))}
            </StyledFileInputWrapper>
          )
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              iconName="AttachFile"
              size="small"
              edge="end"
              disabled={disabled || readonly}
              onClick={handleAttachClick}
            />
          </InputAdornment>
        }
        onClick={handleInputClick}
      />
      {dialogOpen && (
        <FileModal
          title={label ?? ""}
          fileGroupId={value}
          accept={accept}
          multiple={multiple}
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
        />
      )}
    </StyledFileInputContainer>
  );
}

const StyledFileInputContainer = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "hasChips",
})<{ hasChips: boolean }>(({ hasChips }) => ({
  width: "100%",
  minWidth: 0,

  ...(hasChips && {
    "& .MuiOutlinedInput-input": {
      width: 0,
      flexShrink: 1,
    },
  }),
}));

const StyledFileInputWrapper = styled(Flex)(({ theme }) => ({
  overflowX: "auto",
  scrollbarWidth: "none",

  "&::-webkit-scrollbar": {
    display: "none",
  },

  "& .MuiChip-root": {
    flexShrink: 0,
  },

  "& .MuiChip-clickable:hover": {
    backgroundColor: theme.palette.scale[200],
  },

  "& .MuiChip-clickable:hover:not(:has(.MuiChip-deleteIcon:hover, .MuiChip-icon:hover))":
    {
      backgroundColor: theme.palette.brand.primary,
      color: theme.palette.getContrastText(theme.palette.brand.primary),
    },

  "& .MuiChip-clickable:hover:not(:has(.MuiChip-deleteIcon:hover, .MuiChip-icon:hover)) :is(.MuiChip-deleteIcon, .MuiChip-icon)":
    {
      color: alpha(theme.palette.scale[0], 0.8),
    },

  "& :is(.MuiChip-deleteIcon, .MuiChip-icon):hover": {
    color: theme.palette.scale[900],
  },
}));
