import { ReactNode } from "react";

import { Dialog as MuiDialog } from "@mui/material";

import { Button, ButtonProps } from "@/components/common/button/Button";
import { IconButton } from "@/components/common/button/IconButton";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";

interface DialogProps {
  open: boolean;
  title: string;
  size?: "small" | "medium" | "large";
  actions?: (Omit<ButtonProps, "children"> & { label: string })[];
  children: ReactNode;
  onClose?: () => void;
}

export function Dialog({
  open,
  title,
  size,
  actions,
  children,
  onClose,
}: DialogProps) {
  const handleClose = () => {
    onClose?.();
  };

  if (!open) return;

  return (
    <MuiDialog open={open} size={size} maxWidth={false} onClose={handleClose}>
      <Flex gap={2} align="center" justify="between">
        <Text size="xl" weight="bold">
          {title}
        </Text>
        <IconButton iconName="Close" onClick={handleClose} />
      </Flex>
      <Flex direction="column" grow>
        {children}
      </Flex>
      {actions && (
        <Flex gap={1} justify="end">
          {actions.map(({ label, ...buttonProps }, index) => (
            <Button key={`dialog-action-${index}`} {...buttonProps}>
              {label}
            </Button>
          ))}
        </Flex>
      )}
    </MuiDialog>
  );
}
