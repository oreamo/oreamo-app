import { MouseEvent } from "react";

import {
  IconButton as MuiIconButton,
  Tooltip,
  TooltipProps,
} from "@mui/material";

import { Icon, IconName } from "@/components/common/display/Icon";

export interface IconButtonProps {
  iconName: IconName;
  variant?: "outlined";
  size?: "small" | "medium" | "large";
  edge?: "start" | "end" | false;
  disabled?: boolean;
  tooltip?: {
    message: string;
    placement?: TooltipProps["placement"];
  };
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function IconButton({
  iconName,
  variant,
  size,
  edge,
  disabled,
  tooltip,
  onClick,
}: IconButtonProps) {
  const iconButton = (
    <MuiIconButton
      variant={variant}
      size={size}
      edge={edge}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon iconName={iconName} />
    </MuiIconButton>
  );

  const hasTooltip = !!tooltip;
  if (hasTooltip) {
    return (
      <Tooltip title={tooltip.message} placement={tooltip.placement}>
        {iconButton}
      </Tooltip>
    );
  }

  return iconButton;
}
