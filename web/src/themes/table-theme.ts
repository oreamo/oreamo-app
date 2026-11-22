import type { ThemeOptions } from "@mui/material";

import {
  BORDER_RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/constants/foundation-constant";

export const tableTheme: ThemeOptions = {
  components: {
    MuiTable: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: BORDER_RADIUS.md,
          border: `1px solid ${theme.palette.scale[200]}`,
          borderCollapse: "separate",
          overflow: "hidden",
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: `${SPACING.sm}px ${SPACING.md}px`,

          verticalAlign: "middle",
          borderColor: theme.palette.scale[200],
        }),
        head: ({ theme }) => ({
          width: 240,

          backgroundColor: theme.palette.scale[100],
          color: theme.palette.scale[600],
          fontSize: TYPOGRAPHY.size.sm,
        }),
        body: ({ theme }) => ({
          color: theme.palette.scale[800],
          fontSize: TYPOGRAPHY.size.sm,
        }),
      },
    },
  },
};
