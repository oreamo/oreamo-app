import { Outlet, useLocation } from "react-router";

import { ROUTE } from "@/constants/route-constant";
import { useAuthorization } from "@/hooks/useAuthorization";
import { useEnvironment } from "@/hooks/useEnvironment";
import { AuthorizationError } from "@/models/error-model";

export function AuthorizationGuard() {
  const { pathname } = useLocation();

  const { isAuthorizedMenu, isReadyToAuthorize } = useAuthorization();
  const { isLocalMode } = useEnvironment();

  const isDevPage = pathname.includes(ROUTE.DEV.PATH);
  if (isLocalMode && isDevPage) {
    return <Outlet />;
  }

  if (!isReadyToAuthorize) {
    return null;
  }

  if (isAuthorizedMenu) {
    return <Outlet />;
  }

  throw new AuthorizationError();
}
