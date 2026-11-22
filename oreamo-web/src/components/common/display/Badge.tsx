import { ReactNode } from "react";

import { Badge as MuiBadge } from "@mui/material";

export interface BadgeProps {
  content?: ReactNode;
  max?: number;
  variant?: "standard" | "dot";
  color?: "default" | "primary";
  children: ReactNode;
}

export function Badge({
  content,
  max,
  variant,
  color = "primary",
  children,
}: BadgeProps) {
  return (
    <MuiBadge badgeContent={content} max={max} variant={variant} color={color}>
      {children}
    </MuiBadge>
  );
}
