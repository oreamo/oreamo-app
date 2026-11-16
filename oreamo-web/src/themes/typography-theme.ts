import type { ThemeOptions } from "@mui/material";

import { TYPOGRAPHY } from "@/constants/foundation-constant";

const { size, weight, lineHeight } = TYPOGRAPHY;

export const typographyTheme: ThemeOptions = {
  typography: {
    h1: {
      fontSize: size["5xl"],
      fontWeight: weight.bold,
      lineHeight: lineHeight.tight,
    },
    h2: {
      fontSize: size["4xl"],
      fontWeight: weight.bold,
      lineHeight: lineHeight.tight,
    },
    h3: {
      fontSize: size["3xl"],
      fontWeight: weight.semibold,
      lineHeight: lineHeight.snug,
    },
    h4: {
      fontSize: size["2xl"],
      fontWeight: weight.semibold,
      lineHeight: lineHeight.snug,
    },
    h5: {
      fontSize: size.xl,
      fontWeight: weight.semibold,
      lineHeight: lineHeight.normal,
    },
    h6: {
      fontSize: size.lg,
      fontWeight: weight.medium,
      lineHeight: lineHeight.normal,
    },
    subtitle1: {
      fontSize: size.md,
      fontWeight: weight.medium,
      lineHeight: lineHeight.normal,
    },
    subtitle2: {
      fontSize: size.sm,
      fontWeight: weight.medium,
      lineHeight: lineHeight.normal,
    },
    body1: {
      fontSize: size.md,
      fontWeight: weight.regular,
      lineHeight: lineHeight.relaxed,
    },
    body2: {
      fontSize: size.sm,
      fontWeight: weight.regular,
      lineHeight: lineHeight.relaxed,
    },
    caption: {
      fontSize: size.xs,
      fontWeight: weight.regular,
      lineHeight: lineHeight.normal,
    },
    overline: {
      fontSize: size.xs,
      fontWeight: weight.medium,
      lineHeight: lineHeight.normal,
    },
    button: {
      fontSize: size.sm,
      fontWeight: weight.semibold,
      lineHeight: lineHeight.normal,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          color: theme.palette.scale[800],
          ...(ownerState.size && { fontSize: size[ownerState.size] }),
          ...(ownerState.weight && { fontWeight: weight[ownerState.weight] }),
          ...(ownerState.lineHeight && {
            lineHeight: lineHeight[ownerState.lineHeight],
          }),
        }),
      },
    },
  },
};
