import { FieldPath, FieldValues } from "react-hook-form";

import {
  MultiSelectInput,
  MultiSelectInputProps,
} from "@/components/common/input/MultiSelectInput";
import { SelectInputOption } from "@/components/common/input/SelectInput";
import { Field, FieldProps } from "@/components/data-form/_components/Field";

export type { SelectInputOption as MultiSelectFieldOption };

export interface MultiSelectInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends FieldProps<
  TFieldValues,
  TName,
  Omit<
    MultiSelectInputProps,
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

export function MultiSelectInputField<
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
}: MultiSelectInputFieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field, error }) => (
        <MultiSelectInput
          {...renderProps}
          label={label}
          value={field.value ?? []}
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
