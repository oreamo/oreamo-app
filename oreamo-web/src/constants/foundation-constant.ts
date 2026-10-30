export const PALETTE = {
  light: {
    scale: {
      0: "#ffffff",
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
    surface: {
      default: "#ffffff",
      subtle: "#f0f0f0",
      raised: "#ffffff",
      overlay: "#ffffff",
      field: "#ffffff",
    },
    navigation: {
      background: "#404040",
      text: "#d4d4d4",
      activeBackground: "#262626",
      activeText: "#ffffff",
    },
  },
  dark: {
    scale: {
      0: "#0a0a0a",
      50: "#ffffff08",
      100: "#ffffff0f",
      200: "#ffffff1a",
      300: "#ffffff29",
      400: "#5c5c5c",
      500: "#8f8f8f",
      600: "#a8a8a8",
      700: "#c7c7c7",
      800: "#e0e0e0",
      900: "#f5f5f5",
    },
    surface: {
      default: "#0a0a0a",
      subtle: "#151515",
      raised: "#171717",
      overlay: "#1f1f1f",
      field: "#0a0a0a",
    },
    navigation: {
      background: "#171717",
      text: "#a8a8a8",
      activeBackground: "#ffffff1a",
      activeText: "#f5f5f5",
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
