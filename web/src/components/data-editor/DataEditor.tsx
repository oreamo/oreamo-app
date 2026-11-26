import { Ref } from "react";

import { styled, useTheme } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import type { MDEditorProps, RefMDEditor } from "@uiw/react-md-editor";

import { DataViewer } from "@/components/data-editor/DataViewer";

export interface DataEditorProps extends MDEditorProps {
  ref?: Ref<RefMDEditor>;
}

export function DataEditor({ ref, components, ...props }: DataEditorProps) {
  const theme = useTheme();

  const renderPreview = (source: string) => {
    return <DataViewer value={source} />;
  };

  return (
    <StyledEditor
      ref={ref}
      data-color-mode={theme.palette.mode}
      components={{ preview: renderPreview, ...components }}
      {...props}
    />
  );
}

const StyledEditor = styled(MDEditor)({
  "& .w-md-editor-text-pre *": {
    fontFamily: "inherit !important",
  },
});
