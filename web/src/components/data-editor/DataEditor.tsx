import {
  ClipboardEvent,
  CSSProperties,
  DragEvent,
  lazy,
  Ref,
  Suspense,
} from "react";

import {
  Box,
  CircularProgress,
  LinearProgress,
  styled,
  useTheme,
} from "@mui/material";
import type { MDEditorProps, RefMDEditor } from "@uiw/react-md-editor";

import { Flex } from "@/components/common/layout/Flex";
import { DataViewer } from "@/components/data-editor/DataViewer";
import { FileInfo } from "@/models/file-model";
import { useFileUpload } from "@/resources/file/useFileUpload";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));

export interface DataEditorProps extends MDEditorProps {
  ref?: Ref<RefMDEditor>;
}

export function DataEditor({
  ref,
  components,
  height = 200,
  readOnly,
  onPaste,
  onDragOver,
  onDrop,
  ...props
}: DataEditorProps) {
  const theme = useTheme();

  const { mutate: uploadFiles, isPending: isUploading } = useFileUpload();

  const renderPreview = (source: string) => {
    return <DataViewer value={source} />;
  };

  const getImageFiles = (dataTransfer: DataTransfer) => {
    return Array.from(dataTransfer.files).filter((file) => {
      return file.type.startsWith("image/");
    });
  };

  const getUploadTextarea = (container: HTMLElement) => {
    if (readOnly) return null;
    return container.querySelector("textarea");
  };

  const toImageMarkdown = (file: FileInfo) => {
    const altText = file.fileName.replace(/[[\]]/g, "");
    return `![${altText}](/files/${file.fileGroupId}/${file.fileId}/view)`;
  };

  const uploadImages = (textarea: HTMLTextAreaElement, imageFiles: File[]) => {
    const formData = new FormData();
    imageFiles.forEach((imageFile) => {
      formData.append("uploadFiles", imageFile);
    });

    uploadFiles(formData, {
      onSuccess: async (response) => {
        if (!response.data.succeed) return;

        const { insertTextAtPosition } = await import("@uiw/react-md-editor");
        const imageMarkdown = response.data.data.files
          .map(toImageMarkdown)
          .join("\n");
        insertTextAtPosition(textarea, imageMarkdown);
      },
    });
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    onPaste?.(event);

    const imageFiles = getImageFiles(event.clipboardData);
    const textarea = getUploadTextarea(event.currentTarget);
    if (!imageFiles.length || !textarea) return;

    event.preventDefault();
    uploadImages(textarea, imageFiles);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    onDragOver?.(event);

    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    onDrop?.(event);

    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();

    const imageFiles = getImageFiles(event.dataTransfer);
    const textarea = getUploadTextarea(event.currentTarget);
    if (!imageFiles.length || !textarea) return;

    uploadImages(textarea, imageFiles);
  };

  return (
    <Suspense
      fallback={
        <StyledEditorFallback height={height} align="center" justify="center">
          <CircularProgress size={24} />
        </StyledEditorFallback>
      }
    >
      <StyledEditorContainer>
        <StyledEditor
          ref={ref}
          data-color-mode={theme.palette.mode}
          components={{ preview: renderPreview, ...components }}
          height={height}
          readOnly={readOnly}
          onPaste={handlePaste}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          {...props}
        />
        {isUploading && <StyledUploadProgress />}
      </StyledEditorContainer>
    </Suspense>
  );
}

const StyledEditorFallback = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "height",
})<{ height: CSSProperties["height"] }>(({ theme, height }) => ({
  width: "100%",
  height,

  border: `1px solid ${theme.palette.scale[200]}`,
  borderRadius: theme.shape.borderRadiusScale.sm,
}));

const StyledEditorContainer = styled(Box)({
  position: "relative",
});

const StyledEditor = styled(MDEditor)({
  "&.w-md-editor": {
    "--md-editor-font-family": '"Pretendard Variable", Pretendard, sans-serif',
  },
  "& .w-md-editor-text-pre *": {
    fontFamily: "inherit !important",
  },
});

const StyledUploadProgress = styled(LinearProgress)({
  position: "absolute",
  right: 0,
  bottom: 0,
  left: 0,
});
