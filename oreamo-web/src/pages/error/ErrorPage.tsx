import {
  Navigate,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
} from "react-router";

import { ROUTE } from "@/constants/route-constant";
import { AuthenticationError, AuthorizationError } from "@/models/error-model";
import { ForbiddenErrorContent } from "@/pages/error/_components/ForbiddenErrorContent";
import { NotFoundErrorContent } from "@/pages/error/_components/NotFoundErrorContent";
import { ServerErrorContent } from "@/pages/error/_components/ServerErrorContent";

export function ErrorPage() {
  const error = useRouteError();
  const location = useLocation();

  if (error instanceof AuthenticationError) {
    const redirectUrl = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`${ROUTE.AUTH.LOGIN.URL}?redirectUrl=${encodeURIComponent(redirectUrl)}`}
      />
    );
  }

  if (error instanceof AuthorizationError) {
    return <ForbiddenErrorContent />;
  }

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundErrorContent />;
  }

  return <ServerErrorContent />;
}
