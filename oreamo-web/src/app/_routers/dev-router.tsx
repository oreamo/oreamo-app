import { RouteObject } from "react-router";

import { ROUTE } from "@/constants/route-constant";
import { DevButtonPage } from "@/pages/dev/button/DevButtonPage";
import { DevDisplayPage } from "@/pages/dev/display/DevDisplayPage";
import { DevFoundationPage } from "@/pages/dev/foundation/DevFoundationPage";
import { DevInputPage } from "@/pages/dev/input/DevInputPage";
import { DevLayoutPage } from "@/pages/dev/layout/DevLayoutPage";
import { DevOverlayPage } from "@/pages/dev/overlay/DevOverlayPage";

export const DevRouter: RouteObject[] = [
  {
    id: ROUTE.DEV.ID,
    path: ROUTE.DEV.PATH,
    children: [
      {
        id: ROUTE.DEV.DEV_FOUNDATION.ID,
        path: ROUTE.DEV.DEV_FOUNDATION.PATH,
        element: <DevFoundationPage />,
      },
      {
        id: ROUTE.DEV.DEV_BUTTON.ID,
        path: ROUTE.DEV.DEV_BUTTON.PATH,
        element: <DevButtonPage />,
      },
      {
        id: ROUTE.DEV.DEV_INPUT.ID,
        path: ROUTE.DEV.DEV_INPUT.PATH,
        element: <DevInputPage />,
      },
      {
        id: ROUTE.DEV.DEV_DISPLAY.ID,
        path: ROUTE.DEV.DEV_DISPLAY.PATH,
        element: <DevDisplayPage />,
      },
      {
        id: ROUTE.DEV.DEV_LAYOUT.ID,
        path: ROUTE.DEV.DEV_LAYOUT.PATH,
        element: <DevLayoutPage />,
      },
      {
        id: ROUTE.DEV.DEV_OVERLAY.ID,
        path: ROUTE.DEV.DEV_OVERLAY.PATH,
        element: <DevOverlayPage />,
      },
    ],
  },
];
