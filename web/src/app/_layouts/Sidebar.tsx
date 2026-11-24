import { MouseEvent, useRef, useState } from "react";

import {
  alpha,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";

import { SidebarFlyout } from "@/app/_layouts/SidebarFlyout";
import { IconButton } from "@/components/common/button/IconButton";
import { IconName } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { useMenuMatch } from "@/hooks/useMenuMatch";
import { useNavigator } from "@/hooks/useNavigator";
import { MenuTreeNode } from "@/models/menu-model";

// TODO: Temporary icon mapping for testing. Replace with menu icon data.
const MENU_ICON_NAMES: Record<string, IconName> = {
  USER_SETTING: "PersonOutline",
  PROJECT_SETTING: "FolderOutlined",
  SYSTEM_SETTING: "SettingsOutlined",
  DEV_DESIGN_SYSTEM: "PaletteOutlined",
};

const DEFAULT_MENU_ICON_NAME: IconName = "AppsOutlined";

interface SidebarProps {
  activeMenu?: MenuTreeNode;
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ activeMenu, open, onToggle }: SidebarProps) {
  const { navigate } = useNavigator();
  const { isMenuActive } = useMenuMatch();

  const closeTimerRef = useRef<number | null>(null);

  const [subMenuFlyout, setSubMenuFlyout] = useState<{
    anchorEl: HTMLElement;
    menu: MenuTreeNode;
  } | null>(null);

  const hasSubMenus = (menu: MenuTreeNode) => {
    return (menu.subMenus?.length ?? 0) > 0;
  };

  const handleMenuClick = (menu: MenuTreeNode) => {
    if (menu.url) {
      navigate(menu.url);
    }
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openFlyout = (anchorEl: HTMLElement, menu: MenuTreeNode) => {
    clearCloseTimer();
    setSubMenuFlyout((prev) =>
      prev?.menu.menuId === menu.menuId ? prev : { anchorEl, menu },
    );
  };

  const handleRailItemEnter = (
    event: MouseEvent<HTMLElement>,
    menu: MenuTreeNode,
  ) => {
    if (!hasSubMenus(menu)) {
      clearCloseTimer();
      setSubMenuFlyout(null);
      return;
    }

    openFlyout(event.currentTarget, menu);
  };

  const handleRailItemClick = (
    event: MouseEvent<HTMLElement>,
    menu: MenuTreeNode,
  ) => {
    if (!hasSubMenus(menu)) {
      handleMenuClick(menu);
      return;
    }

    openFlyout(event.currentTarget, menu);
  };

  const handleFlyoutLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setSubMenuFlyout(null);
    }, 150);
  };

  const handleFlyoutClose = () => {
    clearCloseTimer();
    setSubMenuFlyout(null);
  };

  const handleFlyoutMenuClick = (menu: MenuTreeNode) => {
    handleMenuClick(menu);
    handleFlyoutClose();
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
      {!open && (
        <StyledSidebarRailWrapper direction="column">
          {activeMenu?.subMenus?.map((subMenu) => (
            <StyledSidebarRailItem
              key={subMenu.menuId}
              selected={isMenuActive(subMenu)}
              onMouseEnter={(event) => handleRailItemEnter(event, subMenu)}
              onMouseLeave={handleFlyoutLeave}
            >
              <IconButton
                iconName={
                  MENU_ICON_NAMES[subMenu.menuId] ?? DEFAULT_MENU_ICON_NAME
                }
                tooltip={
                  hasSubMenus(subMenu)
                    ? undefined
                    : { message: subMenu.menuName, placement: "right" }
                }
                onClick={(event) => handleRailItemClick(event, subMenu)}
              />
            </StyledSidebarRailItem>
          ))}
        </StyledSidebarRailWrapper>
      )}
      <SidebarFlyout
        open={!!subMenuFlyout}
        anchorEl={subMenuFlyout?.anchorEl}
        menu={subMenuFlyout?.menu}
        onMenuClick={handleFlyoutMenuClick}
        onClose={handleFlyoutClose}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={handleFlyoutLeave}
      />
      {open && (
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
      backgroundColor: theme.palette.navigation.activeBackground,
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

const StyledSidebarRailWrapper = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(2, 0),

  alignItems: "center",
  gap: theme.spacing(0.5),
}));

const StyledSidebarRailItem = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected: boolean }>(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadiusScale.md,

  backgroundColor: selected
    ? theme.palette.navigation.activeBackground
    : "transparent",

  "& .MuiIconButton-root": {
    color: selected
      ? theme.palette.navigation.activeText
      : theme.palette.navigation.text,

    "&:hover": {
      backgroundColor: theme.palette.navigation.activeBackground,
      color: theme.palette.navigation.activeText,
    },
  },
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
