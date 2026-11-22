import { ReactNode } from "react";

import { MenuItem, MenuList } from "@mui/material";

import { Icon, IconName } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";

interface ListProps {
  children: ReactNode;
}

export function List({ children }: ListProps) {
  return <MenuList disablePadding>{children}</MenuList>;
}

interface ListItemProps {
  iconName?: IconName;
  label: ReactNode;
  onClick?: () => void;
}

function ListItem({ iconName, label, onClick }: ListItemProps) {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <MenuItem onClick={handleClick}>
      <Flex gap={2} align="center">
        {iconName && <Icon iconName={iconName} size="sm" />}
        <Text size="sm" color="inherit">
          {label}
        </Text>
      </Flex>
    </MenuItem>
  );
}

List.Item = ListItem;
