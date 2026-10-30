import { LoginInfo } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useSessionUserLogin() {
  return useAction<LoginInfo, void>({
    url: "/session/login",
    method: "post",
    invalidateUrls: ["/session"],
  });
}
