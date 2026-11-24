import { alpha, Divider, styled } from "@mui/material";

import { SidebarList } from "@/app/_layouts/SidebarList";
import { SidebarRail } from "@/app/_layouts/SidebarRail";
import { IconButton } from "@/components/common/button/IconButton";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { useNavigator } from "@/hooks/useNavigator";
import { MenuTreeNode } from "@/models/menu-model";

interface SidebarProps {
  activeMenu?: MenuTreeNode;
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ activeMenu, open, onToggle }: SidebarProps) {
  const { navigate } = useNavigator();

  const handleMenuClick = (menu: MenuTreeNode) => {
    if (menu.url) {
      navigate(menu.url);
    }
  };

  return (
    <StyledSidebarContainer direction="column" open={open}>
      <StyledSidebarToggleWrapper open={open}>
        {open && (
          <StyledSidebarTitle>
            <Text weight="bold" color="inherit">
              {activeMenu?.menuName}
            </Text>
          </StyledSidebarTitle>
        )}
        <IconButton
          iconName="ViewSidebarOutlined"
          size="small"
          onClick={onToggle}
        />
      </StyledSidebarToggleWrapper>
      <StyledSidebarDivider open={open} />
      {open ? (
        <SidebarList
          menus={activeMenu?.subMenus}
          onMenuClick={handleMenuClick}
        />
      ) : (
        <SidebarRail
          menus={activeMenu?.subMenus}
          onMenuClick={handleMenuClick}
        />
      )}
    </StyledSidebarContainer>
  );
}

const StyledSidebarContainer = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? 224 : 48,
  minWidth: open ? 224 : 48,

  overflow: "hidden",
  borderRadius: theme.shape.borderRadiusScale.lg,

  backgroundColor: theme.palette.navigation.background,
}));

const StyledSidebarToggleWrapper = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  padding: open ? theme.spacing(2, 2, 1.5, 2) : theme.spacing(2, 0, 1.5, 0),

  alignItems: "center",
  justifyContent: open ? "space-between" : "center",

  "& .MuiIconButton-root": {
    color: theme.palette.navigation.text,

    "&:hover": {
      backgroundColor: alpha(theme.palette.navigation.text, 0.1),
      color: theme.palette.navigation.activeText,
    },

    "& .MuiSvgIcon-root": {
      transform: "scaleX(-1)",
    },
  },
}));

const StyledSidebarTitle = styled(Flex)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),

  color: theme.palette.navigation.activeText,
}));

const StyledSidebarDivider = styled(Divider, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  marginLeft: theme.spacing(open ? 2 : 1),
  marginRight: theme.spacing(open ? 2 : 1),

  borderColor: alpha(theme.palette.navigation.text, 0.2),
}));
