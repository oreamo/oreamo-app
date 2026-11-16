import { FieldPath, FieldValues } from "react-hook-form";

import {
  SelectInput,
  SelectInputOption,
  SelectInputProps,
} from "@/components/common/input/SelectInput";
import { Field, FieldProps } from "@/components/data-form/_components/Field";

export type { SelectInputOption as SelectFieldOption };

export interface SelectInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends FieldProps<
  TFieldValues,
  TName,
  Omit<
    SelectInputProps,
    | "options"
    | "error"
    | "value"
    | "onChange"
    | "label"
    | "placeholder"
    | "disabled"
    | "readonly"
  >
> {
  options: SelectInputOption[];
}

export function SelectInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  disabled = false,
  readonly = false,
  renderProps,
  options,
  ...fieldProps
}: SelectInputFieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field, error }) => (
        <SelectInput
          {...renderProps}
          ref={field.ref}
          label={label}
          value={field.value ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          readonly={readonly}
          options={options}
          error={error}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
