import { Divider as MuiDivider } from "@mui/material";

export interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return <MuiDivider className={className} />;
}
