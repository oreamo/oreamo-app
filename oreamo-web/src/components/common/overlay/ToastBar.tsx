import { ReactNode } from "react";

import { Snackbar, SnackbarContent } from "@mui/material";

import { IconButton } from "@/components/common/button/IconButton";

interface ToastBarProps {
  open: boolean;
  icon?: ReactNode;
  message?: ReactNode;
  onClose?: () => void;
}

export function ToastBar({ open, icon, message, onClose }: ToastBarProps) {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Snackbar open={open} onClose={handleClose}>
      <SnackbarContent
        message={
          <>
            {icon}
            {message}
          </>
        }
        action={
          <IconButton iconName="Close" size="small" onClick={handleClose} />
        }
      />
    </Snackbar>
  );
}
