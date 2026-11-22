import type { ThemeOptions } from "@mui/material";

import {
  BORDER_RADIUS,
  SIZE,
  TYPOGRAPHY,
} from "@/constants/foundation-constant";

export const inputTheme: ThemeOptions = {
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium",
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          minWidth: 0,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.scale[500],
          "&.Mui-focused": {
            color: theme.palette.scale[700],
          },
          "&.Mui-error": {
            color: theme.palette.semantic.error,
          },
          "&.Mui-disabled": {
            color: theme.palette.scale[300],
          },
        }),
        outlined: {
          "&:not(.MuiInputLabel-shrink):not(.MuiInputLabel-sizeSmall)": {
            transform: "translate(14px, 5px) scale(1)",
          },
          "&.MuiInputLabel-sizeSmall:not(.MuiInputLabel-shrink)": {
            transform: "translate(14px, 1px) scale(1)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: SIZE.md,
          minHeight: 0,
          borderRadius: BORDER_RADIUS.md,
          backgroundColor: theme.palette.surface.field,
          color: theme.palette.scale[800],
          transition: theme.transitions.create(["border-color", "box-shadow"], {
            duration: theme.transitions.duration.short,
          }),
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.scale[300],
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
            borderColor: theme.palette.brand.primary,
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.semantic.error,
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.scale[100],
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.scale[100],
            },
          },
          "&.Mui-readOnly": {
            backgroundColor: theme.palette.scale[100],
          },
          "&.MuiInputBase-multiline": {
            height: "auto",
            padding: `${theme.spacing(1)} 14px`,
            "&.MuiInputBase-adornedStart": {
              alignItems: "flex-start",
            },
            "& .MuiInputAdornment-positionStart": {
              height: "1.4375em",
              maxHeight: "none",
            },
          },
        }),
        notchedOutline: ({ theme }) => ({
          borderColor: theme.palette.scale[200],
          transition: "border-color 0.15s ease",
        }),
        input: {
          minWidth: 0,
          padding: "0 14px",
        },
        inputAdornedStart: {
          paddingLeft: 0,
        },
        inputAdornedEnd: {
          paddingRight: 0,
        },
        inputMultiline: {
          padding: 0,
          resize: "vertical",
        },
        sizeSmall: {
          height: SIZE.sm,
          minHeight: 0,
          borderRadius: BORDER_RADIUS.sm,
        },
        inputSizeSmall: {
          padding: "0 14px",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: TYPOGRAPHY.size.xs,
          color: theme.palette.scale[500],
          marginTop: 4,
          "&.Mui-error": {
            color: theme.palette.semantic.error,
          },
          "&.Mui-disabled": {
            color: theme.palette.scale[300],
          },
        }),
      },
    },
  },
};
