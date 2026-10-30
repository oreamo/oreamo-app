import { List, ListItemButton, ListItemText, styled } from "@mui/material";

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

  const handleSubMenuClick = (subMenu: MenuTreeNode) => {
    if (subMenu.url) {
      navigate(subMenu.url);
    }
  };

  return (
    <StyledSidebarContainer direction="column">
      <StyledSidebarWrapper>
        {activeMenu?.subMenus?.map((subMenu) => (
          <StyledMenuButton
            key={subMenu.menuId}
            selected={isMenuActive(subMenu)}
            onClick={() => handleSubMenuClick(subMenu)}
          >
            <ListItemText
              primary={subMenu.menuName}
              slotProps={{
                primary: { fontSize: 14, fontWeight: 500, color: "inherit" },
              }}
            />
          </StyledMenuButton>
        ))}
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
