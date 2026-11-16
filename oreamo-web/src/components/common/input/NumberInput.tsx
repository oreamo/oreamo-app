import { KeyboardEvent, Ref } from "react";

import { TextField } from "@mui/material";
import { useForkRef } from "@mui/material/utils";
import { NumericFormat, NumberFormatValues } from "react-number-format";

import { InputHelperText } from "@/components/common/input/_components/InputHelperText";
import { useScrollFadeEffect } from "@/components/common/input/_hooks/useScrollFadeEffect";

export interface NumberInputProps {
  ref?: Ref<HTMLInputElement>;
  value?: number | "";
  label?: string;
  placeholder?: string;
  helperText?: string;
  readonly?: boolean;
  disabled?: boolean;
  error?: boolean;
  min?: number;
  max?: number;
  onChange?: (value: number | "") => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export function NumberInput({
  ref,
  value,
  label,
  placeholder,
  helperText,
  readonly,
  disabled,
  error,
  min,
  max,
  onChange,
  onKeyDown,
  onBlur,
}: NumberInputProps) {
  const { scrollFadeRef } = useScrollFadeEffect<HTMLInputElement>({ value });
  const handleRef = useForkRef(ref, scrollFadeRef);

  const isAllowed = ({ floatValue }: NumberFormatValues) => {
    if (floatValue === undefined) {
      return true;
    }

    if (min !== undefined && floatValue < min) {
      return false;
    }

    if (max !== undefined && floatValue > max) {
      return false;
    }

    return true;
  };

  const handleValueChange = (values: NumberFormatValues) => {
    const { floatValue } = values;

    if (floatValue === undefined) {
      onChange?.("");
      return;
    }

    onChange?.(floatValue);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <NumericFormat
      customInput={TextField}
      inputRef={handleRef}
      value={value}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      thousandSeparator
      isAllowed={isAllowed}
      onValueChange={handleValueChange}
      onKeyDown={onKeyDown}
      onBlur={handleBlur}
      slotProps={{
        input: {
          readOnly: readonly,
          startAdornment: helperText && (
            <InputHelperText helperText={helperText} error={error} />
          ),
        },
        htmlInput: {
          min,
          max,
        },
      }}
    />
  );
}
