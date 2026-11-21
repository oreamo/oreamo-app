import type { PaletteOptions, ThemeOptions } from "@mui/material";

import { DARK_SHADOW, PALETTE, SHADOW } from "@/constants/foundation-constant";
import type {
  PaletteNavigation,
  PaletteScale,
  PaletteSemantic,
  PaletteSurface,
} from "@/types/mui";

interface SchemePaletteOptions {
  scale: PaletteScale;
  surface: PaletteSurface;
  navigation: PaletteNavigation;
  semantic: PaletteSemantic;
}

const createSchemePalette = ({
  scale,
  surface,
  navigation,
  semantic,
}: SchemePaletteOptions): PaletteOptions => {
  return {
    contrastThreshold: 4.5,
    scale,
    surface,
    navigation,
    primary: { main: semantic.brand },
    secondary: {
      light: scale[200],
      main: scale[400],
      dark: scale[600],
      contrastText: scale[0],
    },
    info: { main: semantic.info },
    success: { main: semantic.success },
    warning: { main: semantic.warning },
    error: { main: semantic.error },
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
