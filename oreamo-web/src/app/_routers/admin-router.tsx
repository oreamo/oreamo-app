import { RouteObject } from "react-router";

import { ROUTE } from "@/constants/route-constant";
import { AuthorityManagementPage } from "@/pages/admin/authority-management/AuthorityManagementPage";
import { CodeManagementPage } from "@/pages/admin/code-management/CodeManagementPage";
import { MenuManagementPage } from "@/pages/admin/menu-management/MenuManagementPage";
import { TranslationManagementPage } from "@/pages/admin/translation-management/TranslationManagementPage";
import { UserManagementPage } from "@/pages/admin/user-management/UserManagementPage";

export const AdminRouter: RouteObject[] = [
  {
    id: ROUTE.ADMIN.ID,
    path: ROUTE.ADMIN.PATH,
    children: [
      {
        id: ROUTE.ADMIN.CODE_MANAGEMENT.ID,
        path: ROUTE.ADMIN.CODE_MANAGEMENT.PATH,
        element: <CodeManagementPage />,
      },
      {
        id: ROUTE.ADMIN.MENU_MANAGEMENT.ID,
        path: ROUTE.ADMIN.MENU_MANAGEMENT.PATH,
        element: <MenuManagementPage />,
      },
      {
        id: ROUTE.ADMIN.TRANSLATION_MANAGEMENT.ID,
        path: ROUTE.ADMIN.TRANSLATION_MANAGEMENT.PATH,
        element: <TranslationManagementPage />,
      },
      {
        id: ROUTE.ADMIN.USER_MANAGEMENT.ID,
        path: ROUTE.ADMIN.USER_MANAGEMENT.PATH,
        element: <UserManagementPage />,
      },
      {
        id: ROUTE.ADMIN.AUTHORITY_MANAGEMENT.ID,
        path: ROUTE.ADMIN.AUTHORITY_MANAGEMENT.PATH,
        element: <AuthorityManagementPage />,
      },
    ],
  },
];
