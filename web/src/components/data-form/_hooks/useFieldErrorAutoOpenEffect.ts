import { useEffect, useState } from "react";

import {
  FieldPath,
  FieldValues,
  useFormContext,
  useFormState,
} from "react-hook-form";

const FIELD_ERROR_AUTO_OPEN_DURATION = 3000;

interface UseFieldErrorAutoOpenEffectOptions<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  name: TName;
}

export function useFieldErrorAutoOpenEffect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ name }: UseFieldErrorAutoOpenEffectOptions<TFieldValues, TName>) {
  const { getFieldState } = useFormContext<TFieldValues>();
  const formState = useFormState<TFieldValues>({ name });

  const { submitCount } = formState;
  const { invalid } = getFieldState(name, formState);

  const [prevSubmitCount, setPrevSubmitCount] = useState(submitCount);
  const [autoOpenSubmitCount, setAutoOpenSubmitCount] = useState<number>();

  if (submitCount !== prevSubmitCount) {
    setPrevSubmitCount(submitCount);
    setAutoOpenSubmitCount(invalid ? submitCount : undefined);
  }

  useEffect(() => {
    if (autoOpenSubmitCount === undefined) return;

    const closeAutoOpen = () => {
      setAutoOpenSubmitCount(undefined);
    };

    const timeoutId = setTimeout(closeAutoOpen, FIELD_ERROR_AUTO_OPEN_DURATION);
    document.addEventListener("pointerdown", closeAutoOpen);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("pointerdown", closeAutoOpen);
    };
  }, [autoOpenSubmitCount]);

  return {
    autoOpen: invalid && autoOpenSubmitCount !== undefined,
  };
}
