import { BaseSyntheticEvent } from "react";

import {
  DefaultValues,
  FieldErrors,
  FieldValues,
  useForm,
} from "react-hook-form";

import { useSystemAlert } from "@/stores/system-dialog-store";

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
  const alert = useSystemAlert();

  const form = useForm<TFieldValues>({ defaultValues, values });

  const handleError = (errors: FieldErrors<TFieldValues>) => {
    const errorMessage = Object.values(errors)
      .map((error) => {
        return error?.message;
      })
      .find((message): message is string => {
        return typeof message === "string";
      });

    if (errorMessage) {
      alert({
        content: errorMessage,
        onClose: () => {
          onInvalid?.(errors);
        },
      });
    }
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
