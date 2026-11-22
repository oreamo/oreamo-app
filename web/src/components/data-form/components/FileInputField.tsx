import { FieldPath, FieldValues } from "react-hook-form";

import { FileInput, FileInputProps } from "@/components/common/input/FileInput";
import { Field, FieldProps } from "@/components/data-form/_components/Field";

export type FileInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = FieldProps<
  TFieldValues,
  TName,
  Omit<
    FileInputProps,
    | "error"
    | "value"
    | "onChange"
    | "label"
    | "placeholder"
    | "disabled"
    | "readonly"
  >
>;

export function FileInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  disabled = false,
  readonly = false,
  renderProps,
  ...fieldProps
}: FileInputFieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field, error }) => (
        <FileInput
          {...renderProps}
          ref={field.ref}
          value={field.value as string | undefined}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          readonly={readonly}
          error={!!error}
          helperText={error}
          onChange={field.onChange}
        />
      )}
    />
  );
}
