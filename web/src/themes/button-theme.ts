import { alpha, darken } from "@mui/material";
import type { ThemeOptions } from "@mui/material";

import {
  BORDER_RADIUS,
  SIZE,
  TYPOGRAPHY,
} from "@/constants/foundation-constant";

export const buttonTheme: ThemeOptions = {
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiTouchRipple-root": {
            color: theme.palette.scale[900],
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          minWidth: 0,
          textTransform: "none",
          borderRadius: BORDER_RADIUS.md,
          fontWeight: TYPOGRAPHY.weight.semibold,
          lineHeight: TYPOGRAPHY.lineHeight.normal,
          letterSpacing: "0.01em",
          transition: theme.transitions.create(
            ["background-color", "border-color", "color"],
            { duration: theme.transitions.duration.short },
          ),
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.scale[600]}`,
            outlineOffset: 2,
          },
        }),
        contained: ({ theme }) => ({
          backgroundColor: theme.palette.brand.primary,
          color: theme.palette.getContrastText(theme.palette.brand.primary),
          "&:hover": {
            backgroundColor: darken(theme.palette.brand.primary, 0.3),
          },
          "&:active": {
            backgroundColor: darken(theme.palette.brand.primary, 0.3),
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.scale[200],
            color: theme.palette.scale[400],
          },
        }),
        outlined: ({ theme }) => ({
          borderWidth: 1,
          borderColor: theme.palette.scale[300],
          color: theme.palette.scale[900],
          backgroundColor: theme.palette.surface.field,
          "&:hover": {
            borderWidth: 1,
            backgroundColor: alpha(theme.palette.scale[900], 0.1),
            borderColor: theme.palette.scale[500],
          },
          "&.Mui-disabled": {
            borderColor: theme.palette.scale[200],
            color: theme.palette.scale[400],
          },
        }),
        text: ({ theme }) => ({
          color: theme.palette.scale[700],
          "&:hover": { backgroundColor: alpha(theme.palette.scale[900], 0.08) },
          "&.Mui-disabled": { color: theme.palette.scale[400] },
        }),
        sizeSmall: {
          height: SIZE.sm,
          padding: "6px 14px",
          fontSize: TYPOGRAPHY.size.xs,
          borderRadius: BORDER_RADIUS.md,
          "& .MuiButton-startIcon > *:first-of-type, & .MuiButton-endIcon > *:first-of-type":
            { fontSize: TYPOGRAPHY.size.xs },
        },
        sizeMedium: {
          height: SIZE.md,
          padding: "8px 18px",
          fontSize: TYPOGRAPHY.size.sm,
          borderRadius: BORDER_RADIUS.md,
          "& .MuiButton-startIcon > *:first-of-type, & .MuiButton-endIcon > *:first-of-type":
            { fontSize: TYPOGRAPHY.size.md },
        },
        sizeLarge: {
          height: SIZE.lg,
          padding: "12px 24px",
          fontSize: TYPOGRAPHY.size.md,
          borderRadius: BORDER_RADIUS.md,
          "& .MuiButton-startIcon > *:first-of-type, & .MuiButton-endIcon > *:first-of-type":
            { fontSize: TYPOGRAPHY.size.xl },
        },
      },
    },
    MuiIconButton: {
      variants: [
        {
          props: { variant: "outlined" },
          style: ({ theme }) => ({
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.palette.scale[400],
            borderRadius: BORDER_RADIUS.full,
            "&:hover": {
              borderColor: theme.palette.scale[500],
              backgroundColor: alpha(theme.palette.scale[900], 0.08),
            },
            "&.Mui-disabled": {
              borderColor: theme.palette.scale[200],
            },
          }),
        },
      ],
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: BORDER_RADIUS.full,
          color: theme.palette.scale[700],
          transition: theme.transitions.create(["background-color", "color"], {
            duration: theme.transitions.duration.short,
          }),
          backgroundColor: "transparent",
          border: "1px solid transparent",
          "&:hover": { backgroundColor: alpha(theme.palette.scale[900], 0.08) },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.scale[600]}`,
            outlineOffset: 2,
          },
          "&.Mui-disabled": { color: theme.palette.scale[300] },
          "& .MuiSvgIcon-root": { fontSize: "inherit" },
        }),
        sizeSmall: {
          width: SIZE.sm,
          height: SIZE.sm,
          fontSize: TYPOGRAPHY.size.xs,
        },
        sizeMedium: {
          width: SIZE.md,
          height: SIZE.md,
          fontSize: TYPOGRAPHY.size.md,
        },
        sizeLarge: {
          width: SIZE.lg,
          height: SIZE.lg,
          fontSize: TYPOGRAPHY.size.xl,
        },
      },
    },
  },
};
