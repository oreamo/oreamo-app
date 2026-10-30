import { createBrowserRouter } from "react-router";

import { AuthenticationGuard } from "@/app/_guards/AuthenticationGuard";
import { AuthorizationGuard } from "@/app/_guards/AuthorizationGuard";
import { GuestGuard } from "@/app/_guards/GuestGuard";
import { AppLayout } from "@/app/_layouts/AppLayout";
import { GlobalLayout } from "@/app/_layouts/GlobalLayout";
import { AdminRouter } from "@/app/_routers/admin-router";
import { DevRouter } from "@/app/_routers/dev-router";
import { ROUTE } from "@/constants/route-constant";
import { LoginPage } from "@/pages/auth/login/LoginPage";
import { ErrorPage } from "@/pages/error/ErrorPage";

export const AppRouter = createBrowserRouter([
  {
    element: <GlobalLayout />,
    errorElement: (
      <GlobalLayout>
        <ErrorPage />
      </GlobalLayout>
    ),
    children: [
      {
        element: <GuestGuard />,
        children: [
          {
            id: ROUTE.AUTH.ID,
            path: ROUTE.AUTH.PATH,
            children: [
              {
                id: ROUTE.AUTH.LOGIN.ID,
                path: ROUTE.AUTH.LOGIN.PATH,
                element: <LoginPage />,
              },
            ],
          },
        ],
      },
      {
        element: <AuthenticationGuard />,
        children: [
          {
            element: <AuthorizationGuard />,
            children: [
              {
                element: <AppLayout />,
                children: [
                  {
                    id: ROUTE.MAIN.ID,
                    path: ROUTE.MAIN.PATH,
                    element: <></>,
                  },
                  ...AdminRouter,
                  ...DevRouter,
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
