import { IHeaderParams } from "ag-grid-community";

import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { MenuIconGuideButton } from "@/pages/setting/system/menu-management/_components/MenuIconGuideButton";

export function MenuIconNameHeader({ displayName }: IHeaderParams) {
  return (
    <Flex className="ag-header-cell-label" align="center" justify="center">
      <Text
        className="ag-header-cell-text"
        size="xs"
        weight="semibold"
        color="inherit"
      >
        {displayName}
      </Text>
      <MenuIconGuideButton />
    </Flex>
  );
}
