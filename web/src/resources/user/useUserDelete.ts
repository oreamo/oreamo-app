import { UserDelete } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseUserDeleteOptions {
  username?: string;
}

export function useUserDelete({ username }: UseUserDeleteOptions) {
  return useAction<UserDelete, boolean>({
    url: `/users/${username}`,
    method: "delete",
    invalidateUrls: ["/users"],
  });
}
