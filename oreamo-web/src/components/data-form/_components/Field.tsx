import { ReactElement } from "react";

import {
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
} from "react-hook-form";

import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";

export interface FieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TRenderProps,
> {
  name: TName;
  label?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  validation?: Record<
    string,
    (
      value: FieldPathValue<TFieldValues, TName>,
      formValues: TFieldValues,
    ) => string | undefined
  >;
  dependencies?: FieldPath<TFieldValues>[];
  renderProps?: TRenderProps;
}

export function Field<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TRenderProps,
>({
  name,
  required = false,
  validation,
  dependencies,
  render,
}: FieldProps<TFieldValues, TName, TRenderProps> & {
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
    error?: string;
  }) => ReactElement;
}) {
  const { translate } = useTranslate();

  return (
    <Controller<TFieldValues, TName>
      name={name}
      rules={{
        required: required
          ? translate(TRANSLATION_KEY.common.message.REQUIRED_FORM_VALIDATION)
          : undefined,
        validate: validation,
        deps: dependencies,
      }}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message;

        return render({
          field,
          error: errorMessage ? translate(errorMessage) : undefined,
        });
      }}
    />
  );
}
