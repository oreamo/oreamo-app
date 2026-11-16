import { ReactElement, Ref, cloneElement, useState } from "react";

import { InputAdornment } from "@mui/material";

import { IconButton } from "@/components/common/button/IconButton";
import { TextInput } from "@/components/common/input/TextInput";

export interface SearchInputValue {
  value: string;
  label?: string;
}

export interface SearchInputDialogProps {
  value?: SearchInputValue;
  onConfirm: (value?: SearchInputValue) => void;
  onCancel: () => void;
}

export interface SearchInputProps {
  ref?: Ref<HTMLInputElement>;
  value?: SearchInputValue;
  placeholder?: string;
  helperText?: string;
  readonly?: boolean;
  disabled?: boolean;
  error?: boolean;
  dialog?: ReactElement<Partial<SearchInputDialogProps>>;
  onChange?: (value?: SearchInputValue) => void;
}

export function SearchInput({
  ref,
  value,
  placeholder,
  helperText,
  readonly,
  disabled,
  error,
  dialog,
  onChange,
}: SearchInputProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearchClick = () => {
    setDialogOpen(true);
  };

  const handleDialogConfirm = (nextValue?: SearchInputValue) => {
    onChange?.(nextValue);
    setDialogOpen(false);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <TextInput
        ref={ref}
        value={value?.label ?? value?.value}
        placeholder={placeholder}
        helperText={helperText}
        readonly={readonly}
        disableEditing
        disabled={disabled}
        error={error}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              iconName="Search"
              size="small"
              edge="end"
              disabled={disabled || readonly}
              onClick={handleSearchClick}
            />
          </InputAdornment>
        }
      />
      {dialogOpen &&
        dialog &&
        cloneElement(dialog, {
          value,
          onConfirm: handleDialogConfirm,
          onCancel: handleDialogCancel,
        })}
    </>
  );
}
