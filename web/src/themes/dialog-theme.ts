import { alpha } from "@mui/material";
import type { ThemeOptions } from "@mui/material";

export const dialogTheme: ThemeOptions = {
  components: {
    MuiDialog: {
      defaultProps: {
        size: "medium",
      },
      styleOverrides: {
        paper: ({ theme, ownerState }) => ({
          width: {
            small: "560px",
            medium: "880px",
            large: "1200px",
          }[ownerState.size ?? "medium"],
          minHeight: "240px",

          margin: 0,
          padding: `${theme.spacing(2)} ${theme.spacing(4)}`,

          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(2),

          borderRadius: theme.shape.borderRadiusScale.md,
          border: `1px solid ${theme.palette.scale[300]}`,

          backgroundColor: theme.palette.surface.overlay,
          boxShadow: theme.shadowScale.lg,
        }),
        backdrop: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.common.black, 0.5),
        }),
      },
    },
  },
};
