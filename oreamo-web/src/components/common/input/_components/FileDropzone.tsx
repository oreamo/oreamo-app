import { Box, styled } from "@mui/material";
import { Accept, useDropzone } from "react-dropzone";

import { Icon } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";

export interface FileDropzoneProps {
  accept?: Accept;
  multiple?: boolean;
  disabled?: boolean;
  onDrop: (files: File[]) => void;
}

export function FileDropzone({
  accept,
  multiple = true,
  disabled,
  onDrop,
}: FileDropzoneProps) {
  const { translate } = useTranslate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    disabled,
    onDrop,
  });

  return (
    <StyledFileDropzoneContainer {...getRootProps()} isDragging={isDragActive}>
      <input {...getInputProps()} />
      <Icon iconName="UploadFile" size="large" />
      <Text size="sm">{translate(TRANSLATION_KEY.common.label.ADD)}</Text>
    </StyledFileDropzoneContainer>
  );
}

const StyledFileDropzoneContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging: boolean }>(({ theme, isDragging }) => ({
  padding: theme.spacing(3),

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),

  border: `1px dashed ${isDragging ? theme.palette.scale[900] : theme.palette.scale[300]}`,
  borderRadius: theme.shape.borderRadius,

  backgroundColor: isDragging ? theme.palette.scale[100] : "transparent",
  color: theme.palette.scale[500],
  cursor: "pointer",

  "&:hover": {
    borderColor: theme.palette.scale[900],
  },

  "& > *": {
    pointerEvents: "none",
  },
}));
