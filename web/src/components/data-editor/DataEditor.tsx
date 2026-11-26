import { CSSProperties, lazy, Ref, Suspense } from "react";

import { CircularProgress, styled, useTheme } from "@mui/material";
import type { MDEditorProps, RefMDEditor } from "@uiw/react-md-editor";

import { Flex } from "@/components/common/layout/Flex";
import { DataViewer } from "@/components/data-editor/DataViewer";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));

const DEFAULT_HEIGHT = 200;

export interface DataEditorProps extends MDEditorProps {
  ref?: Ref<RefMDEditor>;
}

export function DataEditor({
  ref,
  components,
  height = DEFAULT_HEIGHT,
  ...props
}: DataEditorProps) {
  const theme = useTheme();

  const renderPreview = (source: string) => {
    return <DataViewer value={source} />;
  };

  return (
    <Suspense
      fallback={
        <StyledEditorFallback height={height} align="center" justify="center">
          <CircularProgress size={24} />
        </StyledEditorFallback>
      }
    >
      <StyledEditor
        ref={ref}
        data-color-mode={theme.palette.mode}
        components={{ preview: renderPreview, ...components }}
        height={height}
        {...props}
      />
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

const StyledEditor = styled(MDEditor)({
  "&.w-md-editor": {
    "--md-editor-font-family": '"Pretendard Variable", Pretendard, sans-serif',
  },
  "& .w-md-editor-text-pre *": {
    fontFamily: "inherit !important",
  },
});
