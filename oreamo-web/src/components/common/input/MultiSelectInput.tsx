import { MouseEvent, Ref, SyntheticEvent, useState } from "react";

import {
  Autocomplete,
  chipClasses,
  MenuItem,
  styled,
  TextField,
} from "@mui/material";

import { Chip } from "@/components/common/display/Chip";
import { InputHelperText } from "@/components/common/input/_components/InputHelperText";
import { SelectOptionList } from "@/components/common/input/_components/SelectOptionList";
import { useScrollFadeEffect } from "@/components/common/input/_hooks/useScrollFadeEffect";
import { SelectInputOption } from "@/components/common/input/SelectInput";
import { Flex } from "@/components/common/layout/Flex";
import { Dropdown } from "@/components/common/overlay/Dropdown";
import { useMedia } from "@/hooks/useMedia";

type SelectBoxValue = string | number;

export interface MultiSelectInputProps {
  ref?: Ref<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  openOnFocus?: boolean;
  error?: string;
  options: SelectInputOption[];
  value?: SelectBoxValue[];
  onChange?: (value: SelectBoxValue[]) => void;
  onBlur?: () => void;
}

export function MultiSelectInput({
  ref,
  label,
  placeholder,
  readonly = false,
  disabled = false,
  openOnFocus = false,
  error,
  options,
  value = [],
  onChange,
  onBlur,
}: MultiSelectInputProps) {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { isDesktop } = useMedia();
  const { scrollFadeRef } = useScrollFadeEffect<HTMLDivElement>({ value });

  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  const handleChange = (_: SyntheticEvent, newValue: SelectInputOption[]) => {
    onChange?.(newValue.map((option) => option.value));
  };

  const openOptions = () => {
    if (!isDesktop) {
      setSheetOpen(true);
      return;
    }

    setOpen(true);
  };

  const handleOpen = () => {
    openOptions();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChipListMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (readonly || disabled) return;

    if ((e.target as Element).closest(`.${chipClasses.deleteIcon}`)) return;

    openOptions();
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
  };

  const handleSheetSelect = (newValue: SelectBoxValue) => {
    onChange?.(
      value.includes(newValue)
        ? value.filter((item) => item !== newValue)
        : [...value, newValue],
    );
  };

  return (
    <>
      <Autocomplete
        multiple
        fullWidth
        disableCloseOnSelect
        openOnFocus={openOnFocus}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readonly}
        popupIcon={readonly || disabled ? null : undefined}
        getOptionLabel={(option) => String(option.label)}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        renderOption={(props, option, { selected }) => (
          <MenuItem
            {...props}
            key={option.value}
            selected={selected}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        )}
        renderValue={(tagValue, getItemProps) => (
          <StyledMultiSelectInputContainer
            ref={scrollFadeRef}
            gap={0.5}
            align="center"
            grow
            onMouseDown={handleChipListMouseDown}
          >
            {tagValue.map((option, index) => {
              const { key, className, onDelete } = getItemProps({ index });

              return (
                <Chip
                  key={key}
                  className={className}
                  label={option.label}
                  size="small"
                  disabled={disabled}
                  onDelete={readonly || disabled ? undefined : onDelete}
                />
              );
            })}
          </StyledMultiSelectInputContainer>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={ref}
            label={label}
            placeholder={selectedOptions.length === 0 ? placeholder : undefined}
            error={!!error}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: error ? (
                  <>
                    <InputHelperText helperText={error} error />
                    {params.InputProps.startAdornment}
                  </>
                ) : (
                  params.InputProps.startAdornment
                ),
              },
              htmlInput: {
                ...params.inputProps,
                readOnly: true,
              },
            }}
            sx={{ "& .MuiAutocomplete-input": { caretColor: "transparent" } }}
          />
        )}
      />
      {!isDesktop && (
        <Dropdown open={sheetOpen} title={label} onClose={handleSheetClose}>
          <SelectOptionList
            options={options}
            selectedValues={value}
            onSelect={handleSheetSelect}
          />
        </Dropdown>
      )}
    </>
  );
}

const StyledMultiSelectInputContainer = styled(Flex)({
  height: 24,

  overflowX: "auto",
  scrollbarWidth: "none",

  "&::-webkit-scrollbar": {
    display: "none",
  },
});
