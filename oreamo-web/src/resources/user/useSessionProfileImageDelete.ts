import { useAction } from "@/resources/_hooks/useAction";

export function useSessionProfileImageDelete() {
  return useAction<void, boolean>({
    url: "/session/profile-image",
    method: "delete",
    invalidateUrls: ["/session/user-info"],
  });
}
