import { ReactElement, Ref, cloneElement, useState } from "react";

import { InputAdornment, styled } from "@mui/material";

import { IconButton } from "@/components/common/button/IconButton";
import { Chip } from "@/components/common/display/Chip";
import { useScrollFadeEffect } from "@/components/common/input/_hooks/useScrollFadeEffect";
import { SearchInputValue } from "@/components/common/input/SearchInput";
import { TextInput } from "@/components/common/input/TextInput";
import { Flex } from "@/components/common/layout/Flex";

export interface MultiSearchInputDialogProps {
  value: SearchInputValue[];
  onConfirm: (value: SearchInputValue[]) => void;
  onCancel: () => void;
}

export interface MultiSearchInputProps {
  ref?: Ref<HTMLInputElement>;
  value?: SearchInputValue[];
  label?: string;
  placeholder?: string;
  helperText?: string;
  readonly?: boolean;
  disabled?: boolean;
  error?: boolean;
  dialog?: ReactElement<Partial<MultiSearchInputDialogProps>>;
  onChange?: (value: SearchInputValue[]) => void;
}

export function MultiSearchInput({
  ref,
  value = [],
  label,
  placeholder,
  helperText,
  readonly,
  disabled,
  error,
  dialog,
  onChange,
}: MultiSearchInputProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { scrollFadeRef } = useScrollFadeEffect<HTMLDivElement>({ value });

  const handleChipDelete = (itemValue: string) => {
    onChange?.(value.filter((item) => item.value !== itemValue));
  };

  const handleSearchClick = () => {
    setDialogOpen(true);
  };

  const handleDialogConfirm = (nextValue: SearchInputValue[]) => {
    onChange?.(nextValue);
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const hasChips = value.length > 0;

  return (
    <StyledMultiSearchInputContainer direction="column" hasChips={hasChips}>
      <TextInput
        ref={ref}
        label={label}
        placeholder={hasChips ? undefined : placeholder}
        helperText={helperText}
        readonly={readonly}
        disableEditing
        disabled={disabled}
        error={error}
        startAdornment={
          hasChips && (
            <StyledMultiSearchInputWrapper
              ref={scrollFadeRef}
              gap={0.5}
              align="center"
              grow
            >
              {value.map((item) => (
                <Chip
                  key={item.value}
                  label={item.label ?? item.value}
                  size="small"
                  color="secondary"
                  disabled={disabled}
                  onDelete={
                    readonly || disabled
                      ? undefined
                      : () => handleChipDelete(item.value)
                  }
                />
              ))}
            </StyledMultiSearchInputWrapper>
          )
        }
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
          onCancel: handleDialogClose,
        })}
    </StyledMultiSearchInputContainer>
  );
}

const StyledMultiSearchInputContainer = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "hasChips",
})<{ hasChips: boolean }>(({ hasChips }) => ({
  width: "100%",
  minWidth: 0,

  ...(hasChips && {
    "& .MuiOutlinedInput-input": {
      width: 0,
      flexShrink: 1,
    },
  }),
}));

const StyledMultiSearchInputWrapper = styled(Flex)({
  overflowX: "auto",
  scrollbarWidth: "none",

  "&::-webkit-scrollbar": {
    display: "none",
  },

  "& .MuiChip-root": {
    height: 20,

    flexShrink: 0,
  },
});
