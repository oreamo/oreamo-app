import { FocusEvent, MouseEvent, ReactNode, Ref } from "react";

import { Box, styled } from "@mui/material";

export interface FlexProps {
  ref?: Ref<HTMLDivElement>;
  className?: string;
  direction?: "row" | "column";
  gap?: number;
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  grow?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
  onMouseDown?: (event: MouseEvent<HTMLDivElement>) => void;
}

export function Flex({
  ref,
  className,
  direction = "row",
  gap = 0,
  align,
  justify,
  wrap = false,
  grow = false,
  fullWidth = false,
  fullHeight = false,
  children,
  onClick,
  onBlur,
  onMouseDown,
}: FlexProps) {
  return (
    <StyledFlexContainer
      ref={ref}
      className={className}
      direction={direction}
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap}
      grow={grow}
      fullWidth={fullWidth}
      fullHeight={fullHeight}
      onClick={onClick}
      onBlur={onBlur}
      onMouseDown={onMouseDown}
    >
      {children}
    </StyledFlexContainer>
  );
}

const StyledFlexContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "direction" &&
    prop !== "gap" &&
    prop !== "align" &&
    prop !== "justify" &&
    prop !== "wrap" &&
    prop !== "grow" &&
    prop !== "fullWidth" &&
    prop !== "fullHeight",
})<{
  direction: "row" | "column";
  gap: number;
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end" | "between";
  wrap: boolean;
  grow: boolean;
  fullWidth: boolean;
  fullHeight: boolean;
}>(
  ({
    theme,
    direction,
    gap,
    align,
    justify,
    wrap,
    grow,
    fullWidth,
    fullHeight,
  }) => ({
    display: "flex",
    flexDirection: direction,
    alignItems:
      align &&
      {
        start: "flex-start",
        center: "center",
        end: "flex-end",
      }[align],
    justifyContent:
      justify &&
      {
        start: "flex-start",
        center: "center",
        end: "flex-end",
        between: "space-between",
      }[justify],
    gap: theme.spacing(gap),

    ...(wrap && { flexWrap: "wrap" }),
    ...(grow && { flex: 1, minWidth: 0, minHeight: 0 }),
    ...(fullWidth && { width: "100%" }),
    ...(fullHeight && { height: "100%" }),
  }),
);
