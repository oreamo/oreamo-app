import { ReactNode } from "react";

import { Popover, styled } from "@mui/material";

import { BottomSheet } from "@/components/common/overlay/_components/BottomSheet";
import { useMedia } from "@/hooks/useMedia";

interface DropdownProps {
  open: boolean;
  anchorEl?: HTMLElement | null;
  align?: "left" | "right";
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

export function Dropdown({
  open,
  anchorEl,
  align = "left",
  title,
  children,
  onClose,
}: DropdownProps) {
  const { isDesktop } = useMedia();

  const handleClose = () => {
    onClose?.();
  };

  if (isDesktop) {
    return (
      <StyledDropdownPopover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: align }}
        transformOrigin={{ vertical: "top", horizontal: align }}
        onClose={handleClose}
      >
        {children}
      </StyledDropdownPopover>
    );
  }

  return (
    <BottomSheet open={open} title={title ?? ""} onClose={handleClose}>
      {children}
    </BottomSheet>
  );
}

const StyledDropdownPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPopover-paper": {
    marginTop: theme.spacing(1),

    border: `1px solid ${theme.palette.scale[200]}`,
    borderRadius: theme.shape.borderRadiusScale.md,

    backgroundColor: theme.palette.surface.overlay,
    boxShadow: theme.shadowScale.md,
    backgroundImage: "none",
  },
}));
