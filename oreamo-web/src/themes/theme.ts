import { createTheme } from "@mui/material";

import { alertTheme } from "@/themes/alert-theme";
import { borderRadiusTheme } from "@/themes/border-radius-theme";
import { breakpointTheme } from "@/themes/breakpoint-theme";
import { buttonTheme } from "@/themes/button-theme";
import { colorSchemeTheme } from "@/themes/color-scheme-theme";
import { datePickerTheme } from "@/themes/date-picker-theme";
import { dialogTheme } from "@/themes/dialog-theme";
import { drawerTheme } from "@/themes/drawer-theme";
import { iconTheme } from "@/themes/icon-theme";
import { inputTheme } from "@/themes/input-theme";
import { paperTheme } from "@/themes/paper-theme";
import { progressTheme } from "@/themes/progress-theme";
import { selectTheme } from "@/themes/select-theme";
import { snackbarTheme } from "@/themes/snackbar-theme";
import { spacingTheme } from "@/themes/spacing-theme";
import { switchTheme } from "@/themes/switch-theme";
import { tableTheme } from "@/themes/table-theme";
import { toggleTheme } from "@/themes/toggle-theme";
import { tooltipTheme } from "@/themes/tooltip-theme";
import { typographyTheme } from "@/themes/typography-theme";

export const theme = createTheme(
  {
    ...colorSchemeTheme,
    ...typographyTheme,
    ...spacingTheme,
    ...borderRadiusTheme,
    ...breakpointTheme,
  },
  alertTheme,
  buttonTheme,
  datePickerTheme,
  dialogTheme,
  drawerTheme,
  iconTheme,
  inputTheme,
  paperTheme,
  progressTheme,
  selectTheme,
  snackbarTheme,
  switchTheme,
  tableTheme,
  toggleTheme,
  tooltipTheme,
);
