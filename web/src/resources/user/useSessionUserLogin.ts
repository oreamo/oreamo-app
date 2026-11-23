import { LoginInfo, LoginResult } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useSessionUserLogin() {
  return useAction<LoginInfo, LoginResult>({
    url: "/session/login",
    method: "post",
    invalidateUrls: ["/session"],
    throwOnError: false,
  });
}
