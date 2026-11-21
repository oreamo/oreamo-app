import { MouseEvent, ReactNode, useRef } from "react";

import { ToggleButton, ToggleButtonGroup, styled } from "@mui/material";

import { useToggleIndicatorEffect } from "@/components/common/button/_hooks/useToggleIndicatorEffect";
import { Flex } from "@/components/common/layout/Flex";

export type ToggleOptions = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export interface ToggleProps {
  value?: string;
  options: ToggleOptions[];
  size?: "small" | "medium" | "large";
  onChange?: (value?: string) => void;
}

export function Toggle({
  value,
  options,
  size = "medium",
  onChange,
}: ToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { rect } = useToggleIndicatorEffect({ containerRef, value });

  const handleChange = (_: MouseEvent<HTMLElement>, newValue?: string) => {
    onChange?.(newValue);
  };

  return (
    <ToggleButtonGroup
      ref={containerRef}
      exclusive
      value={value ?? null}
      size={size}
      onChange={handleChange}
      sx={{ position: "relative" }}
    >
      {rect && <StyledIndicator left={rect.left} width={rect.width} />}
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          data-value={option.value}
          disabled={option.disabled}
          sx={{ position: "relative", zIndex: 1 }}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

const StyledIndicator = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "left" && prop !== "width",
})<{ left: number; width: number }>(({ theme, left, width }) => ({
  width,
  height: "100%",

  position: "absolute",
  top: 0,
  left,

  backgroundColor: theme.palette.primary.main,

  transition: theme.transitions.create(["left", "width"], {
    duration: theme.transitions.duration.short,
  }),
}));
