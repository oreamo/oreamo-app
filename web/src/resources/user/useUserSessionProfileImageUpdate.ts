import { UserProfileImageUpdate } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useUserSessionProfileImageUpdate() {
  return useAction<UserProfileImageUpdate, void>({
    url: "/user-session/profile-image",
    method: "put",
    invalidateUrls: ["/session/user-info"],
  });
}
