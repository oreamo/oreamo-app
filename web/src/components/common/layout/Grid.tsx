import { ReactNode } from "react";

import { Box, styled } from "@mui/material";

export type GridColumns =
  | number
  | {
      desktop?: number;
      tablet?: number;
      phone?: number;
    };

export interface GridProps {
  className?: string;
  columns?: GridColumns;
  template?: string;
  gap?: number;
  children: ReactNode;
}

export function Grid({
  className,
  columns = 1,
  template,
  gap = 0,
  children,
}: GridProps) {
  return (
    <StyledGridContainer
      className={className}
      columns={columns}
      template={template}
      gap={gap}
    >
      {children}
    </StyledGridContainer>
  );
}

const getColumnsTemplate = (columns: number) => {
  return `repeat(${columns}, minmax(0, 1fr))`;
};

const StyledGridContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "columns" && prop !== "template" && prop !== "gap",
})<{
  columns: GridColumns;
  template?: string;
  gap: number;
}>(({ theme, columns, template, gap }) => ({
  display: "grid",
  gridTemplateColumns:
    template ??
    getColumnsTemplate(
      typeof columns === "number" ? columns : (columns.phone ?? 1),
    ),
  gap: theme.spacing(gap),

  ...(!template &&
    typeof columns !== "number" &&
    columns.tablet !== undefined && {
      [theme.breakpoints.up("tablet")]: {
        gridTemplateColumns: getColumnsTemplate(columns.tablet),
      },
    }),

  ...(!template &&
    typeof columns !== "number" &&
    columns.desktop !== undefined && {
      [theme.breakpoints.up("desktop")]: {
        gridTemplateColumns: getColumnsTemplate(columns.desktop),
      },
    }),
}));
