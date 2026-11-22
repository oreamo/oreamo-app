import { useEffect } from "react";

import { useDataGridStore } from "@/components/data-grid/_stores/data-grid-store";

interface UseDataGridRegisterEffectOptions {
  gridId?: string;
  hasPendingChanges: () => boolean;
  reset: () => void;
}

export function useDataGridRegisterEffect({
  gridId,
  hasPendingChanges,
  reset,
}: UseDataGridRegisterEffectOptions) {
  const register = useDataGridStore((store) => store.register);
  const unregister = useDataGridStore((store) => store.unregister);

  useEffect(() => {
    if (!gridId) return;

    register(gridId, { hasPendingChanges, reset });

    return () => {
      unregister(gridId);
    };
  }, [gridId, hasPendingChanges, reset, register, unregister]);
}
