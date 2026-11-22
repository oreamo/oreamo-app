import { FieldPath, FieldValues } from "react-hook-form";

import {
  MultiSearchInput,
  MultiSearchInputProps,
} from "@/components/common/input/MultiSearchInput";
import { SearchInputValue } from "@/components/common/input/SearchInput";
import { Field, FieldProps } from "@/components/data-form/_components/Field";

export type MultiSearchInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = FieldProps<
  TFieldValues,
  TName,
  Omit<
    MultiSearchInputProps,
    | "error"
    | "value"
    | "onChange"
    | "label"
    | "placeholder"
    | "disabled"
    | "readonly"
    | "dialog"
  >
> &
  Pick<MultiSearchInputProps, "dialog">;

export function MultiSearchInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  disabled = false,
  readonly = false,
  dialog,
  renderProps,
  ...fieldProps
}: MultiSearchInputFieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field, error }) => (
        <MultiSearchInput
          {...renderProps}
          ref={field.ref}
          value={(field.value ?? []) as SearchInputValue[]}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          readonly={readonly}
          error={!!error}
          helperText={error}
          dialog={dialog}
          onChange={field.onChange}
        />
      )}
    />
  );
}
