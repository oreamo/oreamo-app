import type { PaletteOptions, ThemeOptions } from "@mui/material";

import { DARK_SHADOW, PALETTE, SHADOW } from "@/constants/foundation-constant";
import type {
  PaletteNavigation,
  PaletteScale,
  PaletteSurface,
} from "@/types/mui";

interface SchemePaletteOptions {
  scale: PaletteScale;
  surface: PaletteSurface;
  navigation: PaletteNavigation;
}

const createSchemePalette = ({
  scale,
  surface,
  navigation,
}: SchemePaletteOptions): PaletteOptions => {
  return {
    scale,
    surface,
    navigation,
    primary: {
      light: scale[700],
      main: scale[900],
      dark: scale[900],
      contrastText: scale[0],
    },
    secondary: {
      light: scale[200],
      main: scale[400],
      dark: scale[600],
      contrastText: scale[0],
    },
    info: {
      light: scale[400],
      main: scale[600],
      dark: scale[800],
      contrastText: scale[0],
    },
    background: {
      default: surface.default,
      paper: surface.overlay,
    },
    text: {
      primary: scale[900],
      secondary: scale[500],
      disabled: scale[400],
    },
    divider: scale[200],
    action: {
      active: scale[900],
      hover: scale[100],
      selected: scale[200],
      disabled: scale[400],
      disabledBackground: scale[100],
    },
  };
};

export const colorSchemeTheme: ThemeOptions = {
  shadowScale: SHADOW,
  colorSchemes: {
    light: {
      palette: createSchemePalette(PALETTE.light),
      shadowScale: SHADOW,
    },
    dark: {
      palette: createSchemePalette(PALETTE.dark),
      shadowScale: DARK_SHADOW,
    },
  },
};
