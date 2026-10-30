import { UserProfileImageUpdate } from "@/models/user-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useSessionProfileImageUpdate() {
  return useAction<UserProfileImageUpdate, void>({
    url: "/session/profile-image",
    method: "put",
    invalidateUrls: ["/session/user-info"],
  });
}
