import { Box, styled, useTheme } from "@mui/material";
import "@uiw/react-markdown-preview/markdown.css";
import Markdown from "react-markdown";
import type { Options } from "react-markdown";
import rehypePrism from "rehype-prism-plus/common";
import remarkGfm from "remark-gfm";

export interface DataViewerProps extends Omit<Options, "children"> {
  className?: string;
  value?: string;
}

export function DataViewer({
  className,
  value,
  remarkPlugins,
  rehypePlugins,
  ...props
}: DataViewerProps) {
  const theme = useTheme();

  return (
    <StyledViewer
      className={`wmde-markdown ${className ?? ""}`}
      data-color-mode={theme.palette.mode}
    >
      <Markdown
        remarkPlugins={[remarkGfm, ...(remarkPlugins ?? [])]}
        rehypePlugins={[
          [rehypePrism, { ignoreMissing: true }],
          ...(rehypePlugins ?? []),
        ]}
        {...props}
      >
        {value}
      </Markdown>
    </StyledViewer>
  );
}

const StyledViewer = styled(Box)({
  "& code, & kbd, & pre, & samp": {
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace !important',
  },
  "& code *, & pre *": {
    fontFamily: "inherit !important",
  },
  "& table": {
    overflow: "auto",
  },
  "& ul": {
    listStyleType: "disc",
  },
  "& ul ul, & ol ul": {
    listStyleType: "circle",
  },
  "& ul ul ul, & ol ul ul": {
    listStyleType: "square",
  },
  "& ol": {
    listStyleType: "decimal",
  },
});
