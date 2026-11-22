import type {} from "@mui/material/styles";
import "@mui/material/Dialog";
import "@mui/material/IconButton";
import "@mui/material/SvgIcon";

import {
  BORDER_RADIUS,
  PALETTE,
  SHADOW,
  TYPOGRAPHY,
} from "@/constants/foundation-constant";

type TypographySize = keyof typeof TYPOGRAPHY.size;
type TypographyWeight = keyof typeof TYPOGRAPHY.weight;
type TypographyLineHeight = keyof typeof TYPOGRAPHY.lineHeight;

export type PaletteScale = Record<keyof typeof PALETTE.light.scale, string>;
export type PaletteSurface = Record<keyof typeof PALETTE.light.surface, string>;
export type PaletteNavigation = Record<
  keyof typeof PALETTE.light.navigation,
  string
>;
export type PaletteBrand = Record<keyof typeof PALETTE.light.brand, string>;
export type PaletteSemantic = Record<
  keyof typeof PALETTE.light.semantic,
  string
>;
export type ShadowScale = Record<keyof typeof SHADOW, string>;

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    phone: true;
    tablet: true;
    desktop: true;
    max: true;
  }

  interface Palette {
    scale: PaletteScale;
    surface: PaletteSurface;
    navigation: PaletteNavigation;
    brand: PaletteBrand;
    semantic: PaletteSemantic;
  }

  interface PaletteOptions {
    scale?: PaletteScale;
    surface?: PaletteSurface;
    navigation?: PaletteNavigation;
    brand?: PaletteBrand;
    semantic?: PaletteSemantic;
  }

  interface ColorSystemOptions {
    shadowScale?: ShadowScale;
  }

  interface Theme {
    shadowScale: ShadowScale;
  }

  interface ThemeOptions {
    shadowScale?: ShadowScale;
  }

  interface Shape {
    borderRadiusScale: typeof BORDER_RADIUS;
  }

  interface ShapeOptions {
    borderRadiusScale?: typeof BORDER_RADIUS;
  }
}

declare module "@mui/material/Dialog" {
  interface DialogProps {
    size?: "small" | "medium" | "large";
  }

  interface DialogOwnerState {
    size?: "small" | "medium" | "large";
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    variant?: "outlined";
  }

  interface IconButtonPropsVariantOverrides {
    outlined: true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsSizeOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyOwnProps {
    size?: TypographySize;
    weight?: TypographyWeight;
    lineHeight?: TypographyLineHeight;
  }
}
