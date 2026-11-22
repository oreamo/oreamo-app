import { UserPasswordChange } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useSessionPasswordChange() {
  return useAction<UserPasswordChange, void>({
    url: "/session/password",
    method: "put",
    invalidateUrls: [],
  });
}
