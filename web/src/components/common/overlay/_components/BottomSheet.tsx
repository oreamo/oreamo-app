import { ReactNode } from "react";

import { Drawer } from "@mui/material";

import { Button, ButtonProps } from "@/components/common/button/Button";
import { IconButton } from "@/components/common/button/IconButton";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";

interface BottomSheetProps {
  open: boolean;
  title: string;
  actions?: (Omit<ButtonProps, "children"> & { label: string })[];
  children: ReactNode;
  onClose?: () => void;
}

export function BottomSheet({
  open,
  title,
  actions,
  children,
  onClose,
}: BottomSheetProps) {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={handleClose}>
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
            <Button key={`bottom-sheet-action-${index}`} {...buttonProps}>
              {label}
            </Button>
          ))}
        </Flex>
      )}
    </Drawer>
  );
}
