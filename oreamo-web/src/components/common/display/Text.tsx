import { ReactNode } from "react";

import { Typography as MuiTypography, styled } from "@mui/material";

export interface TextProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "disabled" | "inherit";
  align?: "left" | "center" | "right";
  whiteSpace?: "pre-line" | "pre-wrap";
  breakWord?: boolean;
  ellipsis?: boolean;
  children: ReactNode;
}

export function Text({
  className,
  size = "md",
  weight,
  color,
  align,
  whiteSpace,
  breakWord = false,
  ellipsis = false,
  children,
}: TextProps) {
  return (
    <StyledText
      className={className}
      size={size}
      weight={weight}
      color={
        color &&
        {
          primary: "text.primary",
          secondary: "text.secondary",
          disabled: "text.disabled",
          inherit: "inherit",
        }[color]
      }
      align={align}
      whiteSpace={whiteSpace}
      breakWord={breakWord}
      noWrap={ellipsis}
    >
      {children}
    </StyledText>
  );
}

const StyledText = styled(MuiTypography, {
  shouldForwardProp: (prop) => prop !== "whiteSpace" && prop !== "breakWord",
})<{
  whiteSpace?: "pre-line" | "pre-wrap";
  breakWord: boolean;
}>(({ whiteSpace, breakWord }) => ({
  whiteSpace,

  ...(breakWord && { overflowWrap: "anywhere" }),
}));
