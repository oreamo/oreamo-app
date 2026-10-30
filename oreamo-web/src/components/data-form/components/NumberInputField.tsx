import { FieldPath, FieldValues } from "react-hook-form";

import {
  NumberInput,
  NumberInputProps,
} from "@/components/common/input/NumberInput";
import { Field, FieldProps } from "@/components/data-form/_components/Field";

export interface NumberInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends FieldProps<
  TFieldValues,
  TName,
  Omit<NumberInputProps, "value" | "onChange">
> {}

export function NumberInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  readonly = false,
  disabled = false,
  renderProps,
  ...fieldProps
}: NumberInputFieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field, error }) => (
        <NumberInput
          {...renderProps}
          ref={field.ref}
          value={field.value ?? ""}
          label={label}
          placeholder={placeholder}
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
