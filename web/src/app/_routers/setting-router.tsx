import { RouteObject } from "react-router";

import { ROUTE } from "@/constants/route-constant";
import { AuthorityManagementPage } from "@/pages/setting/system/authority-management/AuthorityManagementPage";
import { CodeManagementPage } from "@/pages/setting/system/code-management/CodeManagementPage";
import { MenuManagementPage } from "@/pages/setting/system/menu-management/MenuManagementPage";
import { TranslationManagementPage } from "@/pages/setting/system/translation-management/TranslationManagementPage";
import { UserManagementPage } from "@/pages/setting/system/user-management/UserManagementPage";
import { ProfilePage } from "@/pages/setting/user/profile/ProfilePage";

export const SettingRouter: RouteObject[] = [
  {
    id: ROUTE.SETTING.ID,
    path: ROUTE.SETTING.PATH,
    children: [
      {
        id: ROUTE.SETTING.USER_SETTING.ID,
        path: ROUTE.SETTING.USER_SETTING.PATH,
        children: [
          {
            id: ROUTE.SETTING.USER_SETTING.PROFILE.ID,
            path: ROUTE.SETTING.USER_SETTING.PROFILE.PATH,
            element: <ProfilePage />,
          },
        ],
      },
      {
        id: ROUTE.SETTING.SYSTEM_SETTING.ID,
        path: ROUTE.SETTING.SYSTEM_SETTING.PATH,
        children: [
          {
            id: ROUTE.SETTING.SYSTEM_SETTING.CODE_MANAGEMENT.ID,
            path: ROUTE.SETTING.SYSTEM_SETTING.CODE_MANAGEMENT.PATH,
            element: <CodeManagementPage />,
          },
          {
            id: ROUTE.SETTING.SYSTEM_SETTING.MENU_MANAGEMENT.ID,
            path: ROUTE.SETTING.SYSTEM_SETTING.MENU_MANAGEMENT.PATH,
            element: <MenuManagementPage />,
          },
          {
            id: ROUTE.SETTING.SYSTEM_SETTING.TRANSLATION_MANAGEMENT.ID,
            path: ROUTE.SETTING.SYSTEM_SETTING.TRANSLATION_MANAGEMENT.PATH,
            element: <TranslationManagementPage />,
          },
          {
            id: ROUTE.SETTING.SYSTEM_SETTING.USER_MANAGEMENT.ID,
            path: ROUTE.SETTING.SYSTEM_SETTING.USER_MANAGEMENT.PATH,
            element: <UserManagementPage />,
          },
          {
            id: ROUTE.SETTING.SYSTEM_SETTING.AUTHORITY_MANAGEMENT.ID,
            path: ROUTE.SETTING.SYSTEM_SETTING.AUTHORITY_MANAGEMENT.PATH,
            element: <AuthorityManagementPage />,
          },
        ],
      },
    ],
  },
];
