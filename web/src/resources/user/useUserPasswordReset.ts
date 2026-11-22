import { UserPasswordReset } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useUserPasswordReset() {
  return useAction<UserPasswordReset, boolean>({
    url: "/users/password/reset",
    invalidateUrls: ["/users"],
  });
}
