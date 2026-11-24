import { ReactNode } from "react";

import {
  ClickAwayListener,
  Popper as MuiPopper,
  PopperPlacementType,
  styled,
} from "@mui/material";

import { Flex } from "@/components/common/layout/Flex";

export type PopperPlacement = PopperPlacementType;

type PopperSide = "top" | "right" | "bottom" | "left";

interface PopperProps {
  open: boolean;
  anchorEl?: HTMLElement | null;
  placement?: PopperPlacement;
  className?: string;
  children: ReactNode;
  onClose?: () => void;
}

export function Popper({
  open,
  anchorEl,
  placement = "right-start",
  className,
  children,
  onClose,
}: PopperProps) {
  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (anchorEl?.contains(event.target as Node)) {
      return;
    }

    onClose?.();
  };

  const getSide = (currentPlacement: PopperPlacement) => {
    return currentPlacement.split("-")[0] as PopperSide;
  };

  return (
    <StyledMuiPopper
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      className={className}
    >
      {({ placement: currentPlacement }) => (
        <ClickAwayListener onClickAway={handleClickAway}>
          <StyledPopperContainer side={getSide(currentPlacement)}>
            {children}
          </StyledPopperContainer>
        </ClickAwayListener>
      )}
    </StyledMuiPopper>
  );
}

const StyledMuiPopper = styled(MuiPopper)(({ theme }) => ({
  zIndex: theme.zIndex.modal,
}));

const StyledPopperContainer = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "side",
})<{ side: PopperSide }>(({ theme, side }) => ({
  ...{
    top: { paddingBottom: theme.spacing(4) },
    right: { paddingLeft: theme.spacing(4) },
    bottom: { paddingTop: theme.spacing(4) },
    left: { paddingRight: theme.spacing(4) },
  }[side],
}));
