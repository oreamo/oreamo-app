import { useEffect, useState } from "react";

interface UseWindowFocusEffectOptions {
  enabled: boolean;
}

export function useWindowFocusEffect({ enabled }: UseWindowFocusEffectOptions) {
  const [prevEnabled, setPrevEnabled] = useState(enabled);
  const [windowFocused, setWindowFocused] = useState(() => {
    return document.hasFocus();
  });

  if (enabled !== prevEnabled) {
    setPrevEnabled(enabled);

    if (enabled) {
      setWindowFocused(document.hasFocus());
    }
  }

  useEffect(() => {
    if (!enabled) return;

    const handleFocus = () => {
      setWindowFocused(true);
    };

    const handleBlur = () => {
      setWindowFocused(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled]);

  return {
    windowFocused,
  };
}
