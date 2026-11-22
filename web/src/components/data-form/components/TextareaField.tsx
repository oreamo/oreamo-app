import { FieldPath, FieldValues } from "react-hook-form";

import { Textarea, TextareaProps } from "@/components/common/input/Textarea";
import { Field, FieldProps } from "@/components/data-form/_components/Field";

export interface TextareaFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends FieldProps<TFieldValues, TName, TextareaProps> {}

export function TextareaField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  disabled = false,
  readonly = false,
  renderProps,
  ...fieldProps
}: TextareaFieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field, error }) => (
        <Textarea
          {...renderProps}
          ref={field.ref}
          value={field.value ?? ""}
          label={label}
          placeholder={placeholder}
          helperText={error}
          readonly={readonly}
          disabled={disabled}
          error={!!error}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
