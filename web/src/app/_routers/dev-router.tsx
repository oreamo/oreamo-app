import { RouteObject } from "react-router";

import { ROUTE } from "@/constants/route-constant";
import { DevButtonPage } from "@/pages/dev/design-system/button/DevButtonPage";
import { DevDisplayPage } from "@/pages/dev/design-system/display/DevDisplayPage";
import { DevFoundationPage } from "@/pages/dev/design-system/foundation/DevFoundationPage";
import { DevInputPage } from "@/pages/dev/design-system/input/DevInputPage";
import { DevLayoutPage } from "@/pages/dev/design-system/layout/DevLayoutPage";
import { DevOverlayPage } from "@/pages/dev/design-system/overlay/DevOverlayPage";
import { DevEditorPage } from "@/pages/dev/solution/editor/DevEditorPage";

export const DevRouter: RouteObject[] = [
  {
    id: ROUTE.DEV.ID,
    path: ROUTE.DEV.PATH,
    children: [
      {
        id: ROUTE.DEV.DEV_DESIGN_SYSTEM.ID,
        path: ROUTE.DEV.DEV_DESIGN_SYSTEM.PATH,
        children: [
          {
            id: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_FOUNDATION.ID,
            path: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_FOUNDATION.PATH,
            element: <DevFoundationPage />,
          },
          {
            id: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_BUTTON.ID,
            path: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_BUTTON.PATH,
            element: <DevButtonPage />,
          },
          {
            id: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_INPUT.ID,
            path: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_INPUT.PATH,
            element: <DevInputPage />,
          },
          {
            id: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_DISPLAY.ID,
            path: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_DISPLAY.PATH,
            element: <DevDisplayPage />,
          },
          {
            id: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_LAYOUT.ID,
            path: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_LAYOUT.PATH,
            element: <DevLayoutPage />,
          },
          {
            id: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_OVERLAY.ID,
            path: ROUTE.DEV.DEV_DESIGN_SYSTEM.DEV_OVERLAY.PATH,
            element: <DevOverlayPage />,
          },
        ],
      },
      {
        id: ROUTE.DEV.DEV_SOLUTION.ID,
        path: ROUTE.DEV.DEV_SOLUTION.PATH,
        children: [
          {
            id: ROUTE.DEV.DEV_SOLUTION.DEV_EDITOR.ID,
            path: ROUTE.DEV.DEV_SOLUTION.DEV_EDITOR.PATH,
            element: <DevEditorPage />,
          },
        ],
      },
    ],
  },
];
