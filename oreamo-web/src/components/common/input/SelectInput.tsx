import { KeyboardEvent, ReactNode, Ref, SyntheticEvent, useState } from "react";

import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { useForkRef } from "@mui/material/utils";

import { InputHelperText } from "@/components/common/input/_components/InputHelperText";
import { SelectOptionList } from "@/components/common/input/_components/SelectOptionList";
import { useScrollFadeEffect } from "@/components/common/input/_hooks/useScrollFadeEffect";
import { Dropdown } from "@/components/common/overlay/Dropdown";
import { useMedia } from "@/hooks/useMedia";

type SelectBoxValue = string | number;

export interface SelectInputOption {
  value: SelectBoxValue;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectInputProps {
  ref?: Ref<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  options: SelectInputOption[];
  error?: string;
  value?: SelectBoxValue | null;
  onChange?: (value: SelectBoxValue | null) => void;
  onBlur?: () => void;
}

export function SelectInput({
  ref,
  label,
  placeholder,
  disabled = false,
  readonly = false,
  options,
  error,
  value,
  onChange,
  onBlur,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { isDesktop } = useMedia();
  const { scrollFadeRef } = useScrollFadeEffect<HTMLInputElement>({ value });
  const handleRef = useForkRef(ref, scrollFadeRef);

  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  const handleChange = (
    _: SyntheticEvent,
    newValue: SelectInputOption | null,
  ) => {
    onChange?.(newValue?.value ?? null);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const handleOpen = () => {
    if (!isDesktop) {
      setSheetOpen(true);
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
  };

  const handleSheetSelect = (newValue: SelectBoxValue) => {
    onChange?.(newValue);
    setSheetOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && open) {
      e.stopPropagation();
    }
  };

  return (
    <>
      <Autocomplete
        fullWidth
        open={open}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        onOpen={handleOpen}
        onClose={handleClose}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        readOnly={readonly}
        popupIcon={readonly || disabled ? null : undefined}
        getOptionLabel={(option) => String(option.label)}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.value} disabled={option.disabled}>
            {option.label}
          </MenuItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={handleRef}
            label={label}
            placeholder={placeholder}
            error={!!error}
            inputProps={{
              ...params.inputProps,
              readOnly: !isDesktop || params.inputProps.readOnly,
            }}
            InputProps={{
              ...params.InputProps,
              readOnly: readonly,
              startAdornment: error && (
                <InputHelperText helperText={error} error />
              ),
            }}
            onBlur={handleBlur}
          />
        )}
      />
      {!isDesktop && (
        <Dropdown open={sheetOpen} title={label} onClose={handleSheetClose}>
          <SelectOptionList
            options={options}
            selectedValues={value != null ? [value] : []}
            onSelect={handleSheetSelect}
          />
        </Dropdown>
      )}
    </>
  );
}
