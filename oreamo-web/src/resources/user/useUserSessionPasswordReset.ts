import { useAction } from "@/resources/_hooks/useAction";

export function useUserSessionPasswordReset() {
  return useAction<void, boolean>({
    url: "/user-session/password/reset",
    invalidateUrls: [],
  });
}
