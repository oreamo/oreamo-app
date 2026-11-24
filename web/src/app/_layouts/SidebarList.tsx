import { List, styled } from "@mui/material";

import { SidebarListItem } from "@/app/_layouts/SidebarListItem";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { MenuTreeNode } from "@/models/menu-model";

interface SidebarListProps {
  menus?: MenuTreeNode[];
  onMenuClick: (menu: MenuTreeNode) => void;
}

export function SidebarList({ menus, onMenuClick }: SidebarListProps) {
  const hasSubMenus = (menu: MenuTreeNode) => {
    return (menu.subMenus?.length ?? 0) > 0;
  };

  return (
    <StyledSidebarWrapper>
      {menus?.map((menu) =>
        hasSubMenus(menu) ? (
          <StyledMenuGroupContainer key={menu.menuId} direction="column">
            <StyledMenuLabelContainer>
              <Text size="sm" weight="bold" color="inherit">
                {menu.menuName}
              </Text>
            </StyledMenuLabelContainer>
            <StyledSubMenuContainer direction="column">
              {menu.subMenus?.map((subMenu) => (
                <SidebarListItem
                  key={subMenu.menuId}
                  menu={subMenu}
                  onMenuClick={onMenuClick}
                />
              ))}
            </StyledSubMenuContainer>
          </StyledMenuGroupContainer>
        ) : (
          <SidebarListItem
            key={menu.menuId}
            menu={menu}
            onMenuClick={onMenuClick}
          />
        ),
      )}
    </StyledSidebarWrapper>
  );
}

const StyledSidebarWrapper = styled(List)(({ theme }) => ({
  padding: theme.spacing(2),

  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.25),
}));

const StyledMenuGroupContainer = styled(Flex)(({ theme }) => ({
  "&:not(:first-of-type)": {
    marginTop: theme.spacing(1.5),
  },
}));

const StyledMenuLabelContainer = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),

  color: theme.palette.navigation.activeText,
}));

const StyledSubMenuContainer = styled(Flex)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),

  gap: theme.spacing(0.25),
}));
