import { FieldPath, FieldValues } from "react-hook-form";

import {
  SearchInput,
  SearchInputProps,
  SearchInputValue,
} from "@/components/common/input/SearchInput";
import { Field, FieldProps } from "@/components/data-form/_components/Field";

export type SearchInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = FieldProps<
  TFieldValues,
  TName,
  Omit<
    SearchInputProps,
    | "error"
    | "value"
    | "onChange"
    | "placeholder"
    | "disabled"
    | "readonly"
    | "dialog"
  >
> &
  Pick<SearchInputProps, "dialog">;

export function SearchInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  placeholder,
  disabled = false,
  readonly = false,
  dialog,
  renderProps,
  ...fieldProps
}: SearchInputFieldProps<TFieldValues, TName>) {
  return (
    <Field
      {...fieldProps}
      render={({ field, error }) => (
        <SearchInput
          {...renderProps}
          ref={field.ref}
          value={field.value as SearchInputValue | undefined}
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
