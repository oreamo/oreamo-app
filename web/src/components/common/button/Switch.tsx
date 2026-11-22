import { ChangeEvent, ReactNode } from "react";

import { FormControlLabel, Switch as MuiSwitch } from "@mui/material";

export interface SwitchProps {
  checked?: boolean;
  label?: ReactNode;
  labelPlacement?: "start" | "end";
  size?: "small" | "medium";
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({
  checked,
  disabled,
  size,
  label,
  labelPlacement = "end",
  onChange,
}: SwitchProps) {
  const handleChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChange?.(checked);
  };

  const control = (
    <MuiSwitch
      checked={checked}
      disabled={disabled}
      size={size}
      onChange={handleChange}
    />
  );

  if (!label) {
    return control;
  }

  return (
    <FormControlLabel
      control={control}
      label={label}
      labelPlacement={labelPlacement}
      disabled={disabled}
    />
  );
}
