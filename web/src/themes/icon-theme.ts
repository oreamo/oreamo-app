import type { ThemeOptions } from "@mui/material";

import { TYPOGRAPHY } from "@/constants/foundation-constant";

export const iconTheme: ThemeOptions = {
  components: {
    MuiSvgIcon: {
      variants: [
        {
          props: { fontSize: "xs" },
          style: {
            fontSize: TYPOGRAPHY.size.md,
          },
        },
        {
          props: { fontSize: "sm" },
          style: {
            fontSize: TYPOGRAPHY.size.xl,
          },
        },
        {
          props: { fontSize: "md" },
          style: {
            fontSize: TYPOGRAPHY.size["2xl"],
          },
        },
        {
          props: { fontSize: "lg" },
          style: {
            fontSize: TYPOGRAPHY.size["4xl"],
          },
        },
        {
          props: { fontSize: "xl" },
          style: {
            fontSize: TYPOGRAPHY.size["5xl"],
          },
        },
      ],
    },
  },
};
