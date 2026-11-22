import { UserSessionUpdate } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useUserSessionUpdate() {
  return useAction<UserSessionUpdate, void>({
    url: "/user-session",
    method: "put",
    invalidateUrls: ["/session/user-info"],
  });
}
