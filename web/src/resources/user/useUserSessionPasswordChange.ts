import { UserSessionPasswordChange } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useUserSessionPasswordChange() {
  return useAction<UserSessionPasswordChange, void>({
    url: "/user-session/password",
    method: "put",
    invalidateUrls: [],
  });
}
