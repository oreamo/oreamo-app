import * as MuiIcons from "@mui/icons-material";

import { IconName } from "@/components/common/display/Icon";

export function useIcon() {
  const isIconName = (name?: string): name is IconName => {
    return !!name && name in MuiIcons;
  };

  return {
    isIconName,
  };
}
