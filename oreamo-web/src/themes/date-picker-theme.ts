import type { ThemeOptions } from "@mui/material";
import "@mui/x-date-pickers/themeAugmentation";

import { BORDER_RADIUS, SIZE, SPACING } from "@/constants/foundation-constant";

export const datePickerTheme: ThemeOptions = {
  components: {
    MuiPickersTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          height: ownerState.inputSize === "small" ? SIZE.sm : SIZE.md,
          minHeight: 0,
          borderRadius:
            ownerState.inputSize === "small"
              ? BORDER_RADIUS.sm
              : BORDER_RADIUS.md,
          backgroundColor: theme.palette.surface.field,
          color: theme.palette.scale[800],
          transition: theme.transitions.create(["border-color", "box-shadow"], {
            duration: theme.transitions.duration.short,
          }),
          "&:hover .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: theme.palette.scale[300],
          },
          "&.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
            borderWidth: 1,
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-error .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: theme.palette.error.main,
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.scale[100],
            "& .MuiPickersOutlinedInput-notchedOutline": {
              borderColor: theme.palette.scale[100],
            },
          },
          "&.Mui-readOnly": {
            backgroundColor: theme.palette.scale[100],
          },
        }),
        notchedOutline: ({ theme }) => ({
          borderColor: theme.palette.scale[200],
          transition: "border-color 0.15s ease",
        }),
        sectionsContainer: {
          padding: 0,
        },
      },
    },
    MuiPickerPopper: {
      styleOverrides: {
        paper: ({ theme }) => ({
          marginTop: SPACING.xs,
          borderRadius: BORDER_RADIUS.md,
          border: `1px solid ${theme.palette.scale[200]}`,
          backgroundColor: theme.palette.surface.overlay,
          boxShadow: theme.shadowScale.md,
          backgroundImage: "none",
        }),
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.scale[700],
          transition: theme.transitions.create(["background-color", "color"], {
            duration: theme.transitions.duration.short,
          }),
          "&:hover": {
            backgroundColor: theme.palette.scale[100],
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover, &:focus": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
          "&.MuiPickerDay-today:not(.Mui-selected)": {
            borderColor: theme.palette.scale[400],
          },
        }),
      },
    },
  },
};
