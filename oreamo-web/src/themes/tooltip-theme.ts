import type { ThemeOptions } from "@mui/material";

import { BORDER_RADIUS, TYPOGRAPHY } from "@/constants/foundation-constant";

export const tooltipTheme: ThemeOptions = {
  components: {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: ({ theme }) => ({
          padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

          borderRadius: BORDER_RADIUS.sm,

          backgroundColor: theme.palette.scale[900],
          color: theme.palette.scale[0],
          boxShadow: theme.shadowScale.sm,

          fontSize: TYPOGRAPHY.size.xs,
          fontWeight: TYPOGRAPHY.weight.medium,
          lineHeight: TYPOGRAPHY.lineHeight.normal,
        }),
        arrow: ({ theme }) => ({
          color: theme.palette.scale[900],
        }),
      },
    },
  },
};
