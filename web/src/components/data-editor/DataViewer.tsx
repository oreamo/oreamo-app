import { Box, styled, useTheme } from "@mui/material";
import "@uiw/react-markdown-preview/markdown.css";
import Markdown, { defaultUrlTransform } from "react-markdown";
import type { Options } from "react-markdown";
import rehypePrism from "rehype-prism-plus/common";
import remarkGfm from "remark-gfm";

import { API_URL } from "@/libs/http-instance";

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

  const transformUrl = (url: string) => {
    const safeUrl = defaultUrlTransform(url);
    if (!safeUrl.startsWith("/files/")) return safeUrl;
    return `${API_URL}${safeUrl}`;
  };

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
        urlTransform={transformUrl}
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
