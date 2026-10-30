import { UserOperate } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useUserOperation() {
  return useAction<UserOperate, boolean>({
    url: "/users/operation",
    invalidateUrls: ["/users"],
  });
}
