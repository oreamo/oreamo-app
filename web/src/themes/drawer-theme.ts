import { alpha } from "@mui/material";
import type { ThemeOptions } from "@mui/material";

export const drawerTheme: ThemeOptions = {
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiBackdrop-root": {
            backgroundColor: alpha(theme.palette.common.black, 0.5),
          },
        }),
        paperAnchorBottom: ({ theme }) => ({
          maxHeight: "90vh",

          padding: theme.spacing(2),

          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(2),

          borderTopLeftRadius: theme.shape.borderRadiusScale.lg,
          borderTopRightRadius: theme.shape.borderRadiusScale.lg,

          backgroundColor: theme.palette.surface.overlay,
          boxShadow: theme.shadowScale.lg,
        }),
      },
    },
  },
};
