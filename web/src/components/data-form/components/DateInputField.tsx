import { FieldPath, FieldValues } from "react-hook-form";

import { DateInput, DateInputProps } from "@/components/common/input/DateInput";
import { Field, FieldProps } from "@/components/data-form/_components/Field";

export interface DateInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends FieldProps<
  TFieldValues,
  TName,
  Omit<DateInputProps, "value" | "onChange">
> {}

export function DateInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  readonly = false,
  disabled = false,
  renderProps,
  ...fieldProps
}: DateInputFieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field, error }) => (
        <DateInput
          {...renderProps}
          ref={field.ref}
          value={field.value ?? undefined}
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
