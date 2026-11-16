import type { ThemeOptions } from "@mui/material";

import { BORDER_RADIUS, TYPOGRAPHY } from "@/constants/foundation-constant";

export const snackbarTheme: ThemeOptions = {
  components: {
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 3000,
      },
      styleOverrides: {
        root: {
          pointerEvents: "none",
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          width: "fit-content",
          pointerEvents: "auto",

          padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,

          display: "flex",
          flexGrow: 0,
          alignItems: "center",
          gap: theme.spacing(1.5),

          borderRadius: BORDER_RADIUS.md,
          border: `1px solid ${theme.palette.scale[900]}33`,

          backgroundColor: theme.palette.scale[900],
          color: theme.palette.scale[0],
          boxShadow: theme.shadowScale.md,

          fontSize: TYPOGRAPHY.size.sm,
          fontWeight: TYPOGRAPHY.weight.medium,
          lineHeight: TYPOGRAPHY.lineHeight.normal,

          "& .MuiSnackbarContent-message": {
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
          },

          "& .MuiSnackbarContent-action": {
            paddingLeft: theme.spacing(1),
            marginRight: 0,
          },

          "& .MuiSvgIcon-root": {
            color: theme.palette.scale[0],
          },
        }),
      },
    },
  },
};
