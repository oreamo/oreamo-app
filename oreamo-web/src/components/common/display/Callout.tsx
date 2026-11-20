import { ReactNode } from "react";

import {
  AlertColor,
  Alert as MuiAlert,
  AlertTitle as MuiAlertTitle,
} from "@mui/material";

interface CalloutProps {
  className?: string;
  type?: AlertColor;
  title?: ReactNode;
  children: ReactNode;
}

export function Callout({ className, type, title, children }: CalloutProps) {
  return (
    <MuiAlert className={className} severity={type}>
      {title && <MuiAlertTitle>{title}</MuiAlertTitle>}
      {children}
    </MuiAlert>
  );
}
