export const PALETTE = {
  light: {
    scale: {
      0: "#ffffff",
      50: "#f9f9fb",
      100: "#f3f4f7",
      200: "#e1e3ea",
      300: "#cdd0da",
      400: "#989dae",
      500: "#656b80",
      600: "#464b5d",
      700: "#363a4a",
      800: "#1f222e",
      900: "#11131d",
    },
    surface: {
      default: "#ffffff",
      subtle: "#edeef3",
      raised: "#ffffff",
      overlay: "#ffffff",
      field: "#ffffff",
    },
    navigation: {
      background: "#363a4a",
      text: "#cdd0da",
      activeBackground: "#1f222e",
      activeText: "#ffffff",
    },
    brand: {
      primary: "#2846bd",
      secondary: "#4d5989",
    },
    semantic: {
      info: "#2276a0",
      success: "#257e55",
      warning: "#9c6511",
      error: "#b82e37",
    },
  },
  dark: {
    scale: {
      0: "#07080c",
      50: "#ffffff08",
      100: "#ffffff0f",
      200: "#ffffff1a",
      300: "#ffffff29",
      400: "#515567",
      500: "#82879d",
      600: "#9ca1b4",
      700: "#bec2d0",
      800: "#dadde5",
      900: "#f3f4f7",
    },
    surface: {
      default: "#07080c",
      subtle: "#10121a",
      raised: "#11131d",
      overlay: "#181b26",
      field: "#07080c",
    },
    navigation: {
      background: "#11131d",
      text: "#9ca1b4",
      activeBackground: "#ffffff1a",
      activeText: "#f3f4f7",
    },
    brand: {
      primary: "#6780e4",
      secondary: "#8e99c2",
    },
    semantic: {
      info: "#54a9d4",
      success: "#40bf84",
      warning: "#e29d36",
      error: "#e35f67",
    },
  },
} as const;

export const SIZE = {
  sm: 24,
  md: 32,
  lg: 40,
} as const;

export const TYPOGRAPHY = {
  size: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

export const SPACING = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 96,
} as const;

export const BREAKPOINTS = {
  phone: 320,
  tablet: 600,
  desktop: 1024,
  max: 1920,
} as const;

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const SHADOW = {
  none: "none",
  xs: `0 1px 2px ${PALETTE.light.scale[900]}0d`,
  sm: `0 1px 3px ${PALETTE.light.scale[900]}1a, 0 1px 2px ${PALETTE.light.scale[900]}0f`,
  md: `0 4px 6px ${PALETTE.light.scale[900]}14, 0 2px 4px ${PALETTE.light.scale[900]}0f`,
  lg: `0 10px 15px ${PALETTE.light.scale[900]}14, 0 4px 6px ${PALETTE.light.scale[900]}0f`,
  xl: `0 20px 25px ${PALETTE.light.scale[900]}14, 0 8px 10px ${PALETTE.light.scale[900]}0f`,
} as const;

export const DARK_SHADOW = {
  none: "none",
  xs: "0 1px 2px #00000066",
  sm: "0 1px 3px #00000080, 0 1px 2px #00000066",
  md: "0 4px 6px #00000066, 0 2px 4px #0000004d",
  lg: "0 10px 15px #00000080, 0 4px 6px #00000066",
  xl: "0 20px 25px #00000099, 0 8px 10px #00000066",
} as const satisfies Record<keyof typeof SHADOW, string>;

export const GRID_WIDTH = {
  xs: 80,
  sm: 100,
  md: 120,
  lg: 150,
  xl: 200,
} as const;
