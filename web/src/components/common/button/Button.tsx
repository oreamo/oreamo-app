import { MouseEvent, ReactNode } from "react";

import { Button as MuiButton, Tooltip, TooltipProps } from "@mui/material";

import { Icon, IconName } from "@/components/common/display/Icon";

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  startIconName?: IconName;
  endIconName?: IconName;
  tooltip?: {
    message: string;
    placement?: TooltipProps["placement"];
  };
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function Button({
  type,
  variant,
  size,
  fullWidth,
  disabled,
  loading,
  startIconName,
  endIconName,
  tooltip,
  children,
  onClick,
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
  };

  const startIcon = (() => {
    if (startIconName) {
      return <Icon iconName={startIconName} />;
    }
  })();

  const endIcon = (() => {
    if (endIconName) {
      return <Icon iconName={endIconName} />;
    }
  })();

  const button = (
    <MuiButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      loading={loading}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={handleClick}
    >
      {children}
    </MuiButton>
  );

  const hasTooltip = !!tooltip;
  if (hasTooltip) {
    return (
      <Tooltip title={tooltip.message} placement={tooltip.placement}>
        {button}
      </Tooltip>
    );
  }

  return button;
}
