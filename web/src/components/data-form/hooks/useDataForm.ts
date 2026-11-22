import { BaseSyntheticEvent } from "react";

import {
  DefaultValues,
  FieldErrors,
  FieldValues,
  useForm,
} from "react-hook-form";

interface UseDataFormOptions<TFieldValues extends FieldValues> {
  values?: TFieldValues;
  defaultValues?: DefaultValues<TFieldValues>;
  onValid: (data: TFieldValues) => void;
  onInvalid?: (errors: FieldErrors<TFieldValues>) => void;
}

export function useDataForm<TFieldValues extends FieldValues>({
  values,
  defaultValues,
  onValid,
  onInvalid,
}: UseDataFormOptions<TFieldValues>) {
  const form = useForm<TFieldValues>({ defaultValues, values });

  const handleError = (errors: FieldErrors<TFieldValues>) => {
    onInvalid?.(errors);
  };

  const handleSubmit = (e?: BaseSyntheticEvent) => {
    form.handleSubmit(onValid, handleError)(e);
  };

  const handleEnter = () => {
    form.handleSubmit(onValid, handleError)();
  };

  return {
    form,
    handleSubmit,
    handleEnter,
  };
}
