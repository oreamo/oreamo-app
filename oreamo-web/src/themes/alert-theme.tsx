import { alpha } from "@mui/material";
import type { ThemeOptions } from "@mui/material";

import { Icon } from "@/components/common/display/Icon";
import { BORDER_RADIUS, TYPOGRAPHY } from "@/constants/foundation-constant";

const ALERT_LINE_HEIGHT = `calc(${TYPOGRAPHY.size.sm} * ${TYPOGRAPHY.lineHeight.normal})`;

export const alertTheme: ThemeOptions = {
  components: {
    MuiAlert: {
      defaultProps: {
        severity: "info",
        iconMapping: {
          info: <Icon iconName="InfoOutlined" size="sm" />,
          success: <Icon iconName="CheckCircleOutline" size="sm" />,
          warning: <Icon iconName="WarningAmber" size="sm" />,
          error: <Icon iconName="ErrorOutline" size="sm" />,
        },
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const color = theme.palette[ownerState.severity ?? "info"].main;

          return {
            padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,

            alignItems: "flex-start",
            gap: theme.spacing(1),

            borderRadius: BORDER_RADIUS.md,
            border: `1px solid ${alpha(color, 0.4)}`,

            backgroundColor: alpha(color, 0.08),
            color: theme.palette.scale[900],

            fontSize: TYPOGRAPHY.size.sm,
            fontWeight: TYPOGRAPHY.weight.regular,
            lineHeight: TYPOGRAPHY.lineHeight.normal,

            "& .MuiAlert-icon": {
              height: ALERT_LINE_HEIGHT,
              padding: 0,
              marginRight: 0,

              display: "flex",
              alignItems: "center",

              color,
              opacity: 1,
            },

            "& .MuiAlert-message": {
              minWidth: 0,
              padding: 0,

              overflowWrap: "anywhere",
            },

            "& .MuiAlertTitle-root": {
              margin: 0,

              color: theme.palette.scale[900],

              fontSize: TYPOGRAPHY.size.sm,
              fontWeight: TYPOGRAPHY.weight.semibold,
              lineHeight: TYPOGRAPHY.lineHeight.normal,
            },
          };
        },
      },
    },
  },
};
