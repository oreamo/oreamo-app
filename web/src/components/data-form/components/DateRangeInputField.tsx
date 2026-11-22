import { FieldPath, FieldValues } from "react-hook-form";

import {
  DateRangeInput,
  DateRangeInputProps,
  DateRangeValue,
} from "@/components/common/input/DateRangeInput";
import { Field, FieldProps } from "@/components/data-form/_components/Field";
import { TRANSLATION_KEY } from "@/constants/translation-constant";

export interface DateRangeInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends FieldProps<
  TFieldValues,
  TName,
  Omit<DateRangeInputProps, "value" | "onChange">
> {}

export function DateRangeInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  readonly = false,
  disabled = false,
  required = false,
  validation,
  renderProps,
  ...fieldProps
}: DateRangeInputFieldProps<TFieldValues, TName>) {
  const validateRequiredRange = (value: unknown) => {
    const [startValue, endValue] = (value ?? []) as DateRangeValue;

    return startValue && endValue
      ? undefined
      : TRANSLATION_KEY.common.message.REQUIRED_FORM_VALIDATION;
  };

  return (
    <Field
      {...fieldProps}
      validation={
        required
          ? { ...validation, requiredRange: validateRequiredRange }
          : validation
      }
      render={({ field, error }) => (
        <DateRangeInput
          {...renderProps}
          value={field.value ?? [undefined, undefined]}
          label={label}
          readonly={readonly}
          disabled={disabled}
          error={!!error}
          helperText={error}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
