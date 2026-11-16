import { useRef } from "react";

interface UseDebounceOptions {
  delayTime?: number;
}

export function useDebounce(options?: UseDebounceOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounceDelayTime = options?.delayTime ?? 1000;

  const debounce = (callback: () => void) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(callback, debounceDelayTime);
  };

  return {
    debounce,
    debounceDelayTime,
  };
}
