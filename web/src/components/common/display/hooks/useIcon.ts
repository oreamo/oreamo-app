import * as MuiIcons from "@mui/icons-material";

import { IconName } from "@/components/common/display/Icon";

export function useIcon() {
  const iconOptions = (() => {
    return Object.keys(MuiIcons).map((name) => ({ value: name, label: name }));
  })();

  const isIconName = (name?: string): name is IconName => {
    return !!name && name in MuiIcons;
  };

  return {
    iconOptions,
    isIconName,
  };
}
