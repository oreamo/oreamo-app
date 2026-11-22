import { Ref } from "react";

import { useTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";

import { InputHelperText } from "@/components/common/input/_components/InputHelperText";
import { PickerBottomSheet } from "@/components/common/input/_components/PickerBottomSheet";
import { DATE_INPUT_TYPE_FORMAT } from "@/constants/date-time-constant";

export type DateInputType = keyof typeof DATE_INPUT_TYPE_FORMAT;

export interface DateInputProps {
  ref?: Ref<HTMLInputElement>;
  type?: DateInputType;
  value?: string;
  label?: string;
  helperText?: string;
  readonly?: boolean;
  disabled?: boolean;
  error?: boolean;
  minDate?: string;
  maxDate?: string;
  onChange?: (value?: string) => void;
  onBlur?: () => void;
}

export function DateInput({
  ref,
  type = "date",
  value,
  label,
  helperText,
  readonly,
  disabled,
  error,
  minDate,
  maxDate,
  onChange,
  onBlur,
}: DateInputProps) {
  const theme = useTheme();

  const format = DATE_INPUT_TYPE_FORMAT[type];

  const handleChange = (newValue: Dayjs | null) => {
    onChange?.(newValue?.isValid() ? newValue.format(format) : undefined);
  };

  const pickerProps = {
    value: value ? dayjs(value, format) : null,
    format,
    readOnly: readonly,
    disabled,
    desktopModeMediaQuery: theme.breakpoints.up("desktop"),
    onChange: handleChange,
    slots: {
      dialog: PickerBottomSheet,
    },
    slotProps: {
      textField: {
        inputRef: ref,
        label,
        error,
        slotProps: {
          input: {
            startAdornment: helperText && (
              <InputHelperText helperText={helperText} error={error} />
            ),
          },
        },
        onBlur,
      },
    },
  };

  if (type === "time") {
    return (
      <TimePicker
        {...pickerProps}
        views={["hours", "minutes", "seconds"]}
        ampm={false}
      />
    );
  }

  if (type === "date-time") {
    return (
      <DateTimePicker
        {...pickerProps}
        views={["year", "day", "hours", "minutes", "seconds"]}
        ampm={false}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
      />
    );
  }

  return (
    <DatePicker
      {...pickerProps}
      minDate={minDate ? dayjs(minDate) : undefined}
      maxDate={maxDate ? dayjs(maxDate) : undefined}
    />
  );
}
