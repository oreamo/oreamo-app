import { UserUpdate } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseUserUpdateOptions {
  username?: string;
}

export function useUserUpdate({ username }: UseUserUpdateOptions) {
  return useAction<UserUpdate, void>({
    url: `/users/${username}`,
    method: "put",
    invalidateUrls: ["/users", "/session/user-info"],
  });
}
