import { alpha, styled } from "@mui/material";

import { SidebarList } from "@/app/_layouts/SidebarList";
import { SidebarRail } from "@/app/_layouts/SidebarRail";
import { IconButton } from "@/components/common/button/IconButton";
import { Divider } from "@/components/common/display/Divider";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { useNavigator } from "@/hooks/useNavigator";
import { MenuTreeNode } from "@/models/menu-model";
import { useSidebarActions, useSidebarOpen } from "@/stores/sidebar-store";

interface SidebarProps {
  activeMenu?: MenuTreeNode;
}

export function Sidebar({ activeMenu }: SidebarProps) {
  const { navigate } = useNavigator();

  const open = useSidebarOpen();
  const { toggle } = useSidebarActions();

  const handleMenuClick = (menu: MenuTreeNode) => {
    if (menu.url) {
      navigate(menu.url);
    }
  };

  const handleToggle = () => {
    toggle();
  };

  return (
    <StyledSidebarContainer direction="column" open={open}>
      <StyledSidebarWrapper direction="column" expanded visible={open}>
        <StyledSidebarGroup expanded>
          <StyledSidebarTitle>
            <Text weight="bold" color="inherit">
              {activeMenu?.menuName}
            </Text>
          </StyledSidebarTitle>
          <IconButton
            iconName="ViewSidebarOutlined"
            size="small"
            onClick={handleToggle}
          />
        </StyledSidebarGroup>
        <StyledSidebarDivider />
        <SidebarList
          menus={activeMenu?.subMenus}
          onMenuClick={handleMenuClick}
        />
      </StyledSidebarWrapper>
      <StyledSidebarWrapper direction="column" expanded={false} visible={!open}>
        <StyledSidebarGroup expanded={false}>
          <IconButton
            iconName="ViewSidebarOutlined"
            size="small"
            onClick={handleToggle}
          />
        </StyledSidebarGroup>
        <StyledSidebarDivider />
        <SidebarRail
          menus={activeMenu?.subMenus}
          onMenuClick={handleMenuClick}
        />
      </StyledSidebarWrapper>
    </StyledSidebarContainer>
  );
}

const StyledSidebarContainer = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? 224 : 48,
  minWidth: open ? 224 : 48,

  position: "relative",
  overflow: "hidden",

  borderRadius: theme.shape.borderRadiusScale.lg,

  backgroundColor: theme.palette.navigation.background,
  transition: theme.transitions.create(["width", "min-width"], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

const StyledSidebarWrapper = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "expanded" && prop !== "visible",
})<{ expanded: boolean; visible: boolean }>(({ theme, expanded, visible }) => ({
  width: expanded ? 224 : 48,

  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,

  opacity: visible ? 1 : 0,
  visibility: visible ? "visible" : "hidden",
  transition: theme.transitions.create(["opacity", "visibility"], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

const StyledSidebarGroup = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "expanded",
})<{ expanded: boolean }>(({ theme, expanded }) => ({
  padding: expanded ? theme.spacing(2, 2, 1.5, 2) : theme.spacing(2, 0, 1.5, 0),

  alignItems: "center",
  justifyContent: expanded ? "space-between" : "center",

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

const StyledSidebarDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),

  borderColor: alpha(theme.palette.navigation.text, 0.2),
}));
