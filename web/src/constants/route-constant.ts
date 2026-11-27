export const ROUTE = {
  AUTH: {
    ID: "AUTH",
    PATH: "auth",
    LOGIN: {
      ID: "LOGIN",
      PATH: "login",
      URL: "/auth/login",
    },
  },
  MAIN: {
    ID: "MAIN",
    PATH: "/",
    URL: "/",
  },
  SETTING: {
    ID: "SETTING",
    PATH: "setting",
    URL: "/setting",
    USER_SETTING: {
      ID: "USER_SETTING",
      PATH: "user",
      URL: "/setting/user",
      PROFILE: {
        ID: "PROFILE",
        PATH: "profile",
        URL: "/setting/user/profile",
      },
    },
    PROJECT_SETTING: {
      ID: "PROJECT_SETTING",
      PATH: "project",
      URL: "/setting/project",
      PROJECT_MANAGEMENT: {
        ID: "PROJECT_MANAGEMENT",
        PATH: "project-management",
        URL: "/setting/project/project-management",
      },
    },
    SYSTEM_SETTING: {
      ID: "SYSTEM_SETTING",
      PATH: "system",
      URL: "/setting/system",
      CODE_MANAGEMENT: {
        ID: "CODE_MANAGEMENT",
        PATH: "code-management",
        URL: "/setting/system/code-management",
      },
      MENU_MANAGEMENT: {
        ID: "MENU_MANAGEMENT",
        PATH: "menu-management",
        URL: "/setting/system/menu-management",
      },
      USER_MANAGEMENT: {
        ID: "USER_MANAGEMENT",
        PATH: "user-management",
        URL: "/setting/system/user-management",
      },
      AUTHORITY_MANAGEMENT: {
        ID: "AUTHORITY_MANAGEMENT",
        PATH: "authority-management",
        URL: "/setting/system/authority-management",
      },
      TRANSLATION_MANAGEMENT: {
        ID: "TRANSLATION_MANAGEMENT",
        PATH: "translation-management",
        URL: "/setting/system/translation-management",
      },
    },
  },
  DEV: {
    ID: "DEV",
    PATH: "dev",
    URL: "/dev",
    DEV_DESIGN_SYSTEM: {
      ID: "DEV_DESIGN_SYSTEM",
      PATH: "design-system",
      URL: "/dev/design-system",
      DEV_FOUNDATION: {
        ID: "DEV_FOUNDATION",
        PATH: "foundation",
        URL: "/dev/design-system/foundation",
      },
      DEV_BUTTON: {
        ID: "DEV_BUTTON",
        PATH: "button",
        URL: "/dev/design-system/button",
      },
      DEV_INPUT: {
        ID: "DEV_INPUT",
        PATH: "input",
        URL: "/dev/design-system/input",
      },
      DEV_DISPLAY: {
        ID: "DEV_DISPLAY",
        PATH: "display",
        URL: "/dev/design-system/display",
      },
      DEV_LAYOUT: {
        ID: "DEV_LAYOUT",
        PATH: "layout",
        URL: "/dev/design-system/layout",
      },
      DEV_OVERLAY: {
        ID: "DEV_OVERLAY",
        PATH: "overlay",
        URL: "/dev/design-system/overlay",
      },
    },
    DEV_SOLUTION: {
      ID: "DEV_SOLUTION",
      PATH: "solution",
      URL: "/dev/solution",
      DEV_EDITOR: {
        ID: "DEV_EDITOR",
        PATH: "editor",
        URL: "/dev/solution/editor",
      },
    },
  },
};
