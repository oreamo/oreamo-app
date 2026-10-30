import { keyframes } from "@mui/material";
import type { ThemeOptions } from "@mui/material";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
`;

export const progressTheme: ThemeOptions = {
  components: {
    MuiCircularProgress: {
      defaultProps: {
        size: 56,
        thickness: 3.6,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.scale[900],
          animation: `${pulse} 1.8s ease-in-out infinite`,

          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }),
        circleIndeterminate: {
          animationDuration: "1.2s",
        },
      },
    },
  },
};
