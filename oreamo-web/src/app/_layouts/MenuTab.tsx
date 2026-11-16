import { MouseEvent } from "react";

import { alpha, styled } from "@mui/material";

import { IconButton } from "@/components/common/button/IconButton";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";

interface MenuTabProps {
  label: string;
  active: boolean;
  closable: boolean;
  onClick: () => void;
  onRefresh: () => void;
  onClose: () => void;
}

export function MenuTab({
  label,
  active,
  closable,
  onClick,
  onRefresh,
  onClose,
}: MenuTabProps) {
  const handleRefreshClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    onRefresh();
  };

  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    onClose();
  };

  return (
    <StyledMenuTabContainer
      gap={0.5}
      align="center"
      active={active}
      onClick={onClick}
    >
      <Text
        size="sm"
        weight={active ? "semibold" : "medium"}
        color={active ? "primary" : "secondary"}
      >
        {label}
      </Text>
      {active && (
        <IconButton
          iconName="Refresh"
          size="small"
          onClick={handleRefreshClick}
        />
      )}
      {closable && (
        <IconButton iconName="Close" size="small" onClick={handleCloseClick} />
      )}
    </StyledMenuTabContainer>
  );
}

const StyledMenuTabContainer = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  height: 28,

  padding: theme.spacing(0, 0.5, 0, 1.5),

  flexShrink: 0,
  position: "relative",

  border: `2px solid ${active ? "transparent" : theme.palette.surface.subtle}`,
  borderBottom: "none",
  borderTopLeftRadius: theme.shape.borderRadiusScale.md,
  borderTopRightRadius: theme.shape.borderRadiusScale.md,

  backgroundColor: active
    ? theme.palette.surface.subtle
    : alpha(theme.palette.surface.subtle, 0.5),
  cursor: "pointer",

  "&:hover": {
    backgroundColor: active
      ? theme.palette.surface.subtle
      : alpha(theme.palette.surface.subtle, 0.75),

    "& .MuiIconButton-root": {
      opacity: 1,
    },
  },

  "& .MuiIconButton-root": {
    flexShrink: 0,
    opacity: active ? 1 : 0.4,
  },

  ...(active && {
    "&::before, &::after": {
      width: theme.shape.borderRadiusScale.md,
      height: theme.shape.borderRadiusScale.md,

      position: "absolute",
      bottom: 0,

      content: '""',
    },

    "&::before": {
      left: -theme.shape.borderRadiusScale.md - 2,

      background: `radial-gradient(circle at 0 0, transparent ${theme.shape.borderRadiusScale.md - 0.5}px, ${theme.palette.surface.subtle} ${theme.shape.borderRadiusScale.md}px)`,
    },

    "&::after": {
      right: -theme.shape.borderRadiusScale.md - 2,

      background: `radial-gradient(circle at 100% 0, transparent ${theme.shape.borderRadiusScale.md - 0.5}px, ${theme.palette.surface.subtle} ${theme.shape.borderRadiusScale.md}px)`,
    },

    "&:first-of-type::before": {
      display: "none",
    },
  }),
}));
