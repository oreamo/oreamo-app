import { MouseEvent } from "react";

import { List, ListItemButton, ListItemText, styled } from "@mui/material";

import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { useNavigator } from "@/hooks/useNavigator";
import { MenuTreeNode } from "@/models/menu-model";
import { useMenuTree } from "@/resources/menu/useMenuTree";

interface MenuListProps {
  open: boolean;
  onClose: () => void;
  onActiveMenuChange: (menu: MenuTreeNode) => void;
}

export function MenuList({ open, onClose, onActiveMenuChange }: MenuListProps) {
  const { navigate } = useNavigator();

  const { data: menuTreeNodes } = useMenuTree();

  const handleMenuClick = (menu: MenuTreeNode) => {
    if (!menu.url) {
      return;
    }

    onActiveMenuChange(menu);
    navigate(menu.url);
    onClose();
  };

  const hasSubMenus = (menu: MenuTreeNode) => (menu.subMenus?.length ?? 0) > 0;

  const handleSubMenuClick = (menu: MenuTreeNode, subMenu: MenuTreeNode) => {
    if (!subMenu.url) {
      return;
    }

    onActiveMenuChange(menu);
    navigate(subMenu.url);
    onClose();
  };

  const handlePanelClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  if (!open) {
    return null;
  }

  return (
    <StyledMenuListContainer onClick={onClose}>
      <StyledMenuListWrapper
        direction="column"
        onClick={handlePanelClick}
        fullHeight
      >
        <StyledMenuListGroup>
          {menuTreeNodes?.map((menu) =>
            hasSubMenus(menu) ? (
              <Flex key={menu.menuId} direction="column">
                <StyledMenuListItem direction="column">
                  <Text>{menu.menuName}</Text>
                </StyledMenuListItem>
                {menu.subMenus?.map((subMenu) => (
                  <StyledSubMenuButton
                    key={subMenu.menuId}
                    onClick={() => handleSubMenuClick(menu, subMenu)}
                  >
                    <ListItemText primary={subMenu.menuName} />
                  </StyledSubMenuButton>
                ))}
              </Flex>
            ) : (
              <StyledMenuButton
                key={menu.menuId}
                onClick={() => handleMenuClick(menu)}
              >
                <ListItemText primary={menu.menuName} />
              </StyledMenuButton>
            ),
          )}
        </StyledMenuListGroup>
      </StyledMenuListWrapper>
    </StyledMenuListContainer>
  );
}

const StyledMenuListContainer = styled(Flex)({
  position: "absolute",
  inset: 0,
  zIndex: 1,

  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
});

const StyledMenuListWrapper = styled(Flex)({
  width: 280,
});

const StyledMenuListGroup = styled(List)(({ theme }) => ({
  padding: theme.spacing(2),

  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.25),
}));

const StyledMenuListItem = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),
}));

const StyledMenuButton = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),

  borderRadius: theme.shape.borderRadiusScale.md,
  color: theme.palette.scale[900],

  "&:hover": {
    backgroundColor: theme.palette.scale[200],
  },
}));

const StyledSubMenuButton = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
  paddingRight: theme.spacing(1.5),

  borderRadius: theme.shape.borderRadiusScale.md,
  color: theme.palette.scale[700],

  "&:hover": {
    backgroundColor: theme.palette.scale[200],
  },
}));
