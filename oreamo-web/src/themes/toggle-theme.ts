import { alpha } from "@mui/material";
import type { ThemeOptions } from "@mui/material";

import {
  BORDER_RADIUS,
  SIZE,
  TYPOGRAPHY,
} from "@/constants/foundation-constant";

export const toggleTheme: ThemeOptions = {
  components: {
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: BORDER_RADIUS.md,
          border: `1px solid ${theme.palette.scale[300]}`,
          backgroundColor: theme.palette.surface.field,
          overflow: "hidden",
        }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          minWidth: 0,
          padding: "8px 18px",
          textTransform: "none",
          border: "none",
          borderLeft: `1px solid ${theme.palette.scale[300]}`,
          borderRadius: 0,
          color: theme.palette.scale[900],
          backgroundColor: "transparent",
          fontSize: TYPOGRAPHY.size.sm,
          fontWeight: TYPOGRAPHY.weight.semibold,
          lineHeight: TYPOGRAPHY.lineHeight.normal,
          transition: theme.transitions.create(
            ["background-color", "border-color", "color"],
            { duration: theme.transitions.duration.short },
          ),
          "&:first-of-type": {
            borderLeft: "none",
          },
          "&:hover": {
            backgroundColor: alpha(theme.palette.scale[900], 0.1),
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.scale[600]}`,
            outlineOffset: -2,
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.scale[900],
            color: theme.palette.scale[0],
            "&:hover": {
              backgroundColor: theme.palette.scale[600],
            },
          },
          "&.Mui-disabled": {
            border: "none",
            borderLeft: `1px solid ${theme.palette.scale[300]}`,
            color: theme.palette.scale[400],
          },
          "&.Mui-disabled:first-of-type": {
            borderLeft: "none",
          },
        }),
        sizeSmall: {
          height: SIZE.sm,
          padding: "6px 14px",
          fontSize: TYPOGRAPHY.size.xs,
        },
        sizeMedium: {
          height: SIZE.md,
          padding: "8px 18px",
          fontSize: TYPOGRAPHY.size.sm,
        },
        sizeLarge: {
          height: SIZE.lg,
          padding: "12px 24px",
          fontSize: TYPOGRAPHY.size.md,
        },
      },
    },
  },
};
