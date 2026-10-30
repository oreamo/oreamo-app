import { FieldPath, FieldValues } from "react-hook-form";

import { TextInput, TextInputProps } from "@/components/common/input/TextInput";
import { Field, FieldProps } from "@/components/data-form/_components/Field";

export interface TextInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends FieldProps<TFieldValues, TName, TextInputProps> {
  maxLength?: number;
}

export function TextInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  readonly = false,
  disabled = false,
  maxLength,
  renderProps,
  ...fieldProps
}: TextInputFieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field, error }) => (
        <TextInput
          {...renderProps}
          ref={field.ref}
          value={field.value ?? ""}
          label={label}
          placeholder={placeholder}
          helperText={error}
          readonly={readonly}
          disabled={disabled}
          error={!!error}
          maxLength={maxLength}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
