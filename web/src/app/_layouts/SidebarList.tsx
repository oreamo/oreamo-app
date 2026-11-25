import { alpha, List, styled } from "@mui/material";

import { SidebarListItem } from "@/app/_layouts/SidebarListItem";
import { useIcon } from "@/components/common/display/hooks/useIcon";
import { Icon, IconName } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { MenuTreeNode } from "@/models/menu-model";

interface SidebarListProps {
  menus?: MenuTreeNode[];
  onMenuClick: (menu: MenuTreeNode) => void;
}

export function SidebarList({ menus, onMenuClick }: SidebarListProps) {
  const { isIconName } = useIcon();

  const getIconName = (menu: MenuTreeNode): IconName => {
    return isIconName(menu.iconName) ? menu.iconName : "AppsOutlined";
  };

  const hasSubMenus = (menu: MenuTreeNode) => {
    return (menu.subMenus?.length ?? 0) > 0;
  };

  return (
    <StyledSidebarListContainer>
      {menus?.map((menu) =>
        hasSubMenus(menu) ? (
          <StyledSidebarListWrapper key={menu.menuId} direction="column">
            <StyledSidebarListLabel gap={1.5} align="center">
              <Icon iconName={getIconName(menu)} size="sm" />
              <Text size="sm" weight="bold" color="inherit">
                {menu.menuName}
              </Text>
            </StyledSidebarListLabel>
            <StyledSidebarListGroup direction="column">
              {menu.subMenus?.map((subMenu) => (
                <SidebarListItem
                  key={subMenu.menuId}
                  menu={subMenu}
                  onMenuClick={onMenuClick}
                />
              ))}
            </StyledSidebarListGroup>
          </StyledSidebarListWrapper>
        ) : (
          <SidebarListItem
            key={menu.menuId}
            menu={menu}
            iconName={getIconName(menu)}
            onMenuClick={onMenuClick}
          />
        ),
      )}
    </StyledSidebarListContainer>
  );
}

const StyledSidebarListContainer = styled(List)(({ theme }) => ({
  padding: theme.spacing(2),

  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.25),
}));

const StyledSidebarListWrapper = styled(Flex)(({ theme }) => ({
  "&:not(:first-of-type)": {
    marginTop: theme.spacing(1.5),
  },
}));

const StyledSidebarListLabel = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),

  color: theme.palette.navigation.activeText,
}));

const StyledSidebarListGroup = styled(Flex)(({ theme }) => ({
  paddingLeft: theme.spacing(6.5),

  gap: theme.spacing(0.25),
  position: "relative",

  "&::before": {
    width: 1,

    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    left: theme.spacing(4),

    backgroundColor: alpha(theme.palette.navigation.text, 0.2),
  },
}));
