import { ReactNode } from "react";

import {
  AlertColor,
  Alert as MuiAlert,
  AlertTitle as MuiAlertTitle,
} from "@mui/material";

interface CalloutProps {
  type?: AlertColor;
  title?: ReactNode;
  children: ReactNode;
}

export function Callout({ type, title, children }: CalloutProps) {
  return (
    <MuiAlert severity={type}>
      {title && <MuiAlertTitle>{title}</MuiAlertTitle>}
      {children}
    </MuiAlert>
  );
}
