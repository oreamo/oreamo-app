import { MouseEvent, ReactNode } from "react";

import {
  ClickAwayListener,
  Popper as MuiPopper,
  PopperPlacementType,
  styled,
} from "@mui/material";

export type PopperPlacement = PopperPlacementType;

interface PopperProps {
  open: boolean;
  anchorEl?: HTMLElement | null;
  placement?: PopperPlacement;
  className?: string;
  children: ReactNode;
  onClose?: () => void;
  onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void;
}

export function Popper({
  open,
  anchorEl,
  placement = "right-start",
  className,
  children,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: PopperProps) {
  const handleClickAway = () => {
    onClose?.();
  };

  return (
    <StyledMuiPopper
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>{children}</div>
      </ClickAwayListener>
    </StyledMuiPopper>
  );
}

const StyledMuiPopper = styled(MuiPopper)(({ theme }) => ({
  zIndex: theme.zIndex.modal,
}));
