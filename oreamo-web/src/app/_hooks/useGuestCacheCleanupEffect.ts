import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

const SESSION_QUERY_KEY = "session";

interface UseGuestCacheCleanupEffectOptions {
  isGuest: boolean;
}

export function useGuestCacheCleanupEffect({
  isGuest,
}: UseGuestCacheCleanupEffectOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isGuest) return;

    queryClient.removeQueries({
      type: "inactive",
      predicate: (query) => query.queryKey[0] !== SESSION_QUERY_KEY,
    });
  }, [isGuest, queryClient]);
}
