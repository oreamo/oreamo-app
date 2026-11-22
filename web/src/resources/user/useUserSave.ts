import { User, UserSave } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useUserSave() {
  return useAction<UserSave, User>({
    url: "/users",
    method: "post",
  });
}
