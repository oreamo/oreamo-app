import type { ThemeOptions } from "@mui/material";

export const paperTheme: ThemeOptions = {
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
};
