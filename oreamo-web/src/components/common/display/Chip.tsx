import { MouseEvent, ReactNode, SyntheticEvent } from "react";

import { Box, Chip as MuiChip, styled } from "@mui/material";

import { Icon, IconName } from "@/components/common/display/Icon";

export interface ChipProps {
  className?: string;
  label: ReactNode;
  size?: "small" | "medium";
  color?: "default" | "primary";
  icon?: IconName;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onIconClick?: () => void;
  onDelete?: (event: SyntheticEvent) => void;
}

export function Chip({
  className,
  label,
  size,
  color,
  icon,
  disabled,
  onClick,
  onIconClick,
  onDelete,
}: ChipProps) {
  const handleIconClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onIconClick) return;

    event.stopPropagation();

    onIconClick();
  };

  return (
    <MuiChip
      className={className}
      label={label}
      size={size}
      color={color}
      icon={
        icon && (
          <StyledChipIcon clickable={!!onIconClick} onClick={handleIconClick}>
            <Icon iconName={icon} />
          </StyledChipIcon>
        )
      }
      disabled={disabled}
      onClick={onClick}
      onDelete={onDelete}
    />
  );
}

const StyledChipIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "clickable",
})<{ clickable: boolean }>(({ clickable }) => ({
  display: "inline-flex",

  ...(clickable && { cursor: "pointer" }),

  "& .MuiSvgIcon-root": {
    fontSize: "inherit",
  },
}));
