import { ChangeEvent, ReactNode, KeyboardEvent, Ref } from "react";

import { TextField } from "@mui/material";
import { useForkRef } from "@mui/material/utils";

import { InputHelperText } from "@/components/common/input/_components/InputHelperText";
import { useScrollFadeEffect } from "@/components/common/input/_hooks/useScrollFadeEffect";

export interface TextInputProps {
  ref?: Ref<HTMLInputElement>;
  type?: "text" | "password";
  value?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  readonly?: boolean;
  disableEditing?: boolean;
  disabled?: boolean;
  error?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  maxLength?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function TextInput({
  ref,
  type = "text",
  value,
  label,
  placeholder,
  helperText,
  readonly,
  disableEditing,
  disabled,
  error,
  startAdornment,
  endAdornment,
  maxLength,
  onChange,
  onKeyDown,
  onClick,
  onFocus,
  onBlur,
}: TextInputProps) {
  const { scrollFadeRef } = useScrollFadeEffect<HTMLInputElement>({ value });
  const handleRef = useForkRef(ref, scrollFadeRef);

  return (
    <TextField
      inputRef={handleRef}
      type={type}
      value={value}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      slotProps={{
        input: {
          readOnly: readonly,
          startAdornment: helperText ? (
            <>
              <InputHelperText helperText={helperText} error={error} />
              {startAdornment}
            </>
          ) : (
            startAdornment
          ),
          endAdornment,
          onClick,
        },
        htmlInput: {
          maxLength,
          readOnly: disableEditing || readonly,
        },
      }}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
