import { Navigate, Outlet, useSearchParams } from "react-router";

import { useGuestCacheCleanupEffect } from "@/app/_hooks/useGuestCacheCleanupEffect";
import { ROUTE } from "@/constants/route-constant";
import { useSessionUserInfo } from "@/resources/user/useSessionUserInfo";

export function GuestGuard() {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");

  const {
    data: userInfo,
    isPending,
    isError,
  } = useSessionUserInfo({
    throwOnError: false,
  });

  const isGuest = !isPending && (isError || !userInfo);

  useGuestCacheCleanupEffect({ isGuest });

  if (isPending) return null;

  if (!isError && userInfo) {
    return <Navigate to={redirectUrl ?? ROUTE.MAIN.URL} replace />;
  }

  return <Outlet />;
}
