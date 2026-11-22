import { ReactNode } from "react";

import { ButtonProps } from "@/components/common/button/Button";
import { BottomSheet } from "@/components/common/overlay/_components/BottomSheet";
import { Dialog } from "@/components/common/overlay/_components/Dialog";
import { useMedia } from "@/hooks/useMedia";

interface ModalProps {
  open: boolean;
  title: string;
  size?: "small" | "medium" | "large";
  actions?: (Omit<ButtonProps, "children"> & { label: string })[];
  children: ReactNode;
  onClose?: () => void;
}

export function Modal({
  open,
  title,
  size,
  actions,
  children,
  onClose,
}: ModalProps) {
  const { isDesktop } = useMedia();

  const handleClose = () => {
    onClose?.();
  };

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        title={title}
        size={size}
        actions={actions}
        onClose={handleClose}
      >
        {children}
      </Dialog>
    );
  }

  return (
    <BottomSheet
      open={open}
      title={title}
      actions={actions}
      onClose={handleClose}
    >
      {children}
    </BottomSheet>
  );
}
