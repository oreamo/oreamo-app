import { RefObject, useLayoutEffect, useState } from "react";

interface IndicatorRect {
  left: number;
  width: number;
}

interface UseToggleIndicatorEffectOptions {
  containerRef: RefObject<HTMLElement | null>;
  value?: string;
}

export function useToggleIndicatorEffect({
  containerRef,
  value,
}: UseToggleIndicatorEffectOptions) {
  const [rect, setRect] = useState<IndicatorRect | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const selectedButton = value
      ? container?.querySelector<HTMLElement>(`[data-value="${value}"]`)
      : null;

    if (!selectedButton) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setRect({
        left: selectedButton.offsetLeft,
        width: selectedButton.offsetWidth,
      });
    });
    observer.observe(selectedButton);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, value]);

  return {
    rect: value ? rect : null,
  };
}
