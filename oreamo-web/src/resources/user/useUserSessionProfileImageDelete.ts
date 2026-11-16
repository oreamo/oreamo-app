import { useAction } from "@/resources/_hooks/useAction";

export function useUserSessionProfileImageDelete() {
  return useAction<void, boolean>({
    url: "/user-session/profile-image",
    method: "delete",
    invalidateUrls: ["/session/user-info"],
  });
}
