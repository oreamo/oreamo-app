import { ReactNode } from "react";

import {
  AlertColor,
  Box,
  Snackbar,
  SnackbarCloseReason,
  SnackbarContent,
  alpha,
  keyframes,
  styled,
} from "@mui/material";

import { IconButton } from "@/components/common/button/IconButton";
import { Flex } from "@/components/common/layout/Flex";

const TOAST_DURATION = 3000;

interface ToastBarProps {
  open: boolean;
  type?: AlertColor;
  icon?: ReactNode;
  message?: ReactNode;
  onClose?: () => void;
}

export function ToastBar({
  open,
  type = "info",
  icon,
  message,
  onClose,
}: ToastBarProps) {
  const handleSnackbarClose = (_: unknown, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;

    onClose?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={TOAST_DURATION}
      onClose={handleSnackbarClose}
    >
      <StyledToastContent
        type={type}
        message={
          <>
            {icon && <StyledToastIcon type={type}>{icon}</StyledToastIcon>}
            {message}
            <StyledToastProgress type={type} duration={TOAST_DURATION} />
          </>
        }
        action={
          <IconButton iconName="Close" size="small" onClick={handleClose} />
        }
      />
    </Snackbar>
  );
}

const shrinkProgress = keyframes`
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
`;

const StyledToastContent = styled(SnackbarContent, {
  shouldForwardProp: (prop) => prop !== "type",
})<{ type: AlertColor }>(({ theme, type }) => ({
  position: "relative",
  overflow: "hidden",

  border: `1px solid ${alpha(theme.palette.semantic[type], 0.4)}`,

  backgroundImage: `linear-gradient(${alpha(theme.palette.semantic[type], 0.08)}, ${alpha(theme.palette.semantic[type], 0.08)})`,
}));

const StyledToastIcon = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "type",
})<{ type: AlertColor }>(({ theme, type }) => ({
  color: theme.palette.semantic[type],
}));

const StyledToastProgress = styled(Box, {
  shouldForwardProp: (prop) => prop !== "type" && prop !== "duration",
})<{ type: AlertColor; duration: number }>(({ theme, type, duration }) => ({
  height: 2,

  position: "absolute",
  right: 0,
  bottom: 0,
  left: 0,

  backgroundColor: theme.palette.semantic[type],

  transformOrigin: "left",
  animation: `${shrinkProgress} ${duration}ms linear forwards`,

  ".MuiSnackbarContent-root:hover &": {
    animationPlayState: "paused",
  },
}));
