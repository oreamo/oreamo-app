import { List, ListItemButton, ListItemText, styled } from "@mui/material";

import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { useMenuMatch } from "@/hooks/useMenuMatch";
import { useNavigator } from "@/hooks/useNavigator";
import { MenuTreeNode } from "@/models/menu-model";

interface SidebarProps {
  activeMenu?: MenuTreeNode;
}

export function Sidebar({ activeMenu }: SidebarProps) {
  const { navigate } = useNavigator();
  const { isMenuActive } = useMenuMatch();

  const hasSubMenus = (menu: MenuTreeNode) => {
    return (menu.subMenus?.length ?? 0) > 0;
  };

  const handleMenuClick = (menu: MenuTreeNode) => {
    if (menu.url) {
      navigate(menu.url);
    }
  };

  const renderMenuButton = (menu: MenuTreeNode) => {
    return (
      <StyledMenuButton
        key={menu.menuId}
        selected={isMenuActive(menu)}
        onClick={() => handleMenuClick(menu)}
      >
        <ListItemText
          primary={menu.menuName}
          slotProps={{
            primary: { fontSize: 14, fontWeight: 500, color: "inherit" },
          }}
        />
      </StyledMenuButton>
    );
  };

  return (
    <StyledSidebarContainer direction="column">
      <StyledSidebarWrapper>
        {activeMenu?.subMenus?.map((subMenu) =>
          hasSubMenus(subMenu) ? (
            <StyledMenuGroupContainer key={subMenu.menuId} direction="column">
              <StyledMenuLabelContainer>
                <Text size="sm" weight="bold" color="inherit">
                  {subMenu.menuName}
                </Text>
              </StyledMenuLabelContainer>
              <StyledSubMenuContainer direction="column">
                {subMenu.subMenus?.map(renderMenuButton)}
              </StyledSubMenuContainer>
            </StyledMenuGroupContainer>
          ) : (
            renderMenuButton(subMenu)
          ),
        )}
      </StyledSidebarWrapper>
    </StyledSidebarContainer>
  );
}

const StyledSidebarContainer = styled(Flex)(({ theme }) => ({
  width: 224,
  minWidth: 224,

  borderRadius: theme.shape.borderRadiusScale.lg,

  backgroundColor: theme.palette.navigation.background,
}));

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

const StyledMenuButton = styled(ListItemButton)(({ theme }) => ({
  minHeight: 32,
  padding: theme.spacing(0.75, 1.5),

  borderRadius: theme.shape.borderRadiusScale.md,
  color: theme.palette.navigation.text,

  "&:hover": {
    backgroundColor: theme.palette.navigation.activeBackground,
    color: theme.palette.navigation.activeText,
  },

  "&.Mui-selected": {
    backgroundColor: theme.palette.navigation.activeBackground,
    color: theme.palette.navigation.activeText,

    "&:hover": {
      backgroundColor: theme.palette.navigation.activeBackground,
    },
  },
}));
