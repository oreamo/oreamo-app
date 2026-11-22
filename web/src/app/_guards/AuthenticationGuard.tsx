import { Outlet, useLocation } from "react-router";

import { ROUTE } from "@/constants/route-constant";
import { useEnvironment } from "@/hooks/useEnvironment";
import { AuthenticationError } from "@/models/error-model";
import { useSessionUserInfo } from "@/resources/user/useSessionUserInfo";

export function AuthenticationGuard() {
  const { pathname } = useLocation();

  const { data: userInfo, isPending, isError } = useSessionUserInfo();
  const { isLocalMode } = useEnvironment();

  const isDevPage = pathname.includes(ROUTE.DEV.PATH);
  if (isLocalMode && isDevPage) {
    return <Outlet />;
  }

  if (isPending) return null;

  if (!isError && userInfo) {
    return <Outlet />;
  }

  throw new AuthenticationError();
}
