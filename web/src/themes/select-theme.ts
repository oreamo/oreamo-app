import type { ThemeOptions } from "@mui/material";

import {
  BORDER_RADIUS,
  SIZE,
  SPACING,
  TYPOGRAPHY,
} from "@/constants/foundation-constant";

export const selectTheme: ThemeOptions = {
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        popupIndicator: {
          border: "none",
          backgroundColor: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
        clearIndicator: {
          border: "none",
          backgroundColor: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
        paper: ({ theme }) => ({
          marginTop: SPACING.xs,
          borderRadius: BORDER_RADIUS.md,
          border: `1px solid ${theme.palette.scale[200]}`,
          backgroundColor: theme.palette.surface.overlay,
          boxShadow: theme.shadowScale.md,
          backgroundImage: "none",
          overflow: "hidden",
        }),
        listbox: ({ theme }) => ({
          maxHeight: 320,
          padding: theme.spacing(1),
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(0.5),
        }),
        option: ({ theme }) => ({
          padding: `${theme.spacing(0.5, 1.5)} !important`,
          minHeight: `${SIZE.sm}px !important`,
        }),
        inputRoot: {
          paddingLeft: "14px !important",
        },
        input: {
          "&.MuiAutocomplete-input": {
            height: "24px !important",
            padding: "0 !important",
          },
        },
      },
      variants: [
        {
          props: { multiple: true },
          style: {
            "& .MuiOutlinedInput-root": {
              alignItems: "center !important",
              paddingTop: "4px !important",
              paddingBottom: "4px !important",
            },
            "& .MuiAutocomplete-input": {
              flexGrow: "0 !important",
              minWidth: "4px !important",
            },
          },
        },
      ],
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: SIZE.sm,
          borderRadius: BORDER_RADIUS.sm,
          color: theme.palette.scale[700],
          fontSize: TYPOGRAPHY.size.sm,
          lineHeight: TYPOGRAPHY.lineHeight.normal,
          transition: theme.transitions.create(["background-color", "color"], {
            duration: theme.transitions.duration.short,
          }),
          "&:hover": {
            backgroundColor: theme.palette.scale[100],
            color: theme.palette.scale[900],
          },
          "&.Mui-focusVisible": {
            backgroundColor: theme.palette.scale[100],
            outline: `2px solid ${theme.palette.scale[500]}`,
            outlineOffset: -2,
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.scale[200],
            color: theme.palette.scale[900],
            fontWeight: TYPOGRAPHY.weight.semibold,
            "&:hover": {
              backgroundColor: theme.palette.scale[200],
            },
            "&.Mui-focusVisible": {
              backgroundColor: theme.palette.scale[200],
            },
          },
          "&.Mui-disabled": {
            color: theme.palette.scale[400],
            opacity: 1,
          },
        }),
      },
    },
  },
};
