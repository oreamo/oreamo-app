import { alpha } from "@mui/material";
import type { ThemeOptions } from "@mui/material";

export const chipTheme: ThemeOptions = {
  components: {
    MuiChip: {
      styleOverrides: {
        colorSecondary: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.brand.secondary, 0.16),
          color: theme.palette.brand.secondary,

          "&.MuiChip-clickable:hover": {
            backgroundColor: alpha(theme.palette.brand.secondary, 0.24),
          },

          "& .MuiChip-deleteIcon": {
            color: alpha(theme.palette.brand.secondary, 0.6),

            "&:hover": {
              color: theme.palette.brand.secondary,
            },
          },
        }),
      },
    },
  },
};
