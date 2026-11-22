import { ChangeEvent, KeyboardEvent, Ref } from "react";

import { TextField } from "@mui/material";
import { useForkRef } from "@mui/material/utils";

import { InputHelperText } from "@/components/common/input/_components/InputHelperText";
import { useScrollFadeEffect } from "@/components/common/input/_hooks/useScrollFadeEffect";

export interface TextareaProps {
  ref?: Ref<HTMLTextAreaElement>;
  value?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  readonly?: boolean;
  disabled?: boolean;
  error?: boolean;
  rows?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export function Textarea({
  ref,
  value,
  label,
  placeholder,
  helperText,
  readonly,
  disabled,
  error,
  rows = 5,
  onChange,
  onKeyDown,
  onBlur,
}: TextareaProps) {
  const { scrollFadeRef } = useScrollFadeEffect<HTMLTextAreaElement>({
    direction: "vertical",
    value,
  });
  const handleRef = useForkRef(ref, scrollFadeRef);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation();
    }

    onKeyDown?.(e);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <TextField
      inputRef={handleRef}
      value={value}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      fullWidth
      multiline
      rows={rows}
      slotProps={{
        input: {
          readOnly: readonly,
          startAdornment: helperText && (
            <InputHelperText helperText={helperText} error={error} />
          ),
        },
      }}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
}
