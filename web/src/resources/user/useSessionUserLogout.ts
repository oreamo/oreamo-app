import { useAction } from "@/resources/_hooks/useAction";

export function useSessionUserLogout() {
  return useAction<void, void>({
    url: "/session",
    method: "delete",
  });
}
