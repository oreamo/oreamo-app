import { User } from "@/models/user-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseUserOptions {
  username?: string;
}

export function useUser({ username }: UseUserOptions) {
  return useFetch<User>({
    url: `/users/${username}`,
    enabled: !!username,
  });
}
