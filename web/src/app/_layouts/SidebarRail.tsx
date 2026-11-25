import { MouseEvent, useState } from "react";

import { alpha, styled } from "@mui/material";

import { SidebarFlyout } from "@/app/_layouts/SidebarFlyout";
import { IconButton } from "@/components/common/button/IconButton";
import { useIcon } from "@/components/common/display/hooks/useIcon";
import { Flex } from "@/components/common/layout/Flex";
import { useMenuMatch } from "@/hooks/useMenuMatch";
import { MenuTreeNode } from "@/models/menu-model";

interface SidebarRailProps {
  menus?: MenuTreeNode[];
  onMenuClick: (menu: MenuTreeNode) => void;
}

export function SidebarRail({ menus, onMenuClick }: SidebarRailProps) {
  const { isMenuActive } = useMenuMatch();
  const { isIconName } = useIcon();

  const [subMenuFlyout, setSubMenuFlyout] = useState<{
    anchorEl: HTMLElement;
    menu: MenuTreeNode;
  } | null>(null);

  const hasSubMenus = (menu: MenuTreeNode) => {
    return (menu.subMenus?.length ?? 0) > 0;
  };

  const openFlyout = (anchorEl: HTMLElement, menu: MenuTreeNode) => {
    setSubMenuFlyout((prev) =>
      prev?.menu.menuId === menu.menuId ? prev : { anchorEl, menu },
    );
  };

  const handleRailItemEnter = (
    event: MouseEvent<HTMLElement>,
    menu: MenuTreeNode,
  ) => {
    if (!hasSubMenus(menu)) {
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
      onMenuClick(menu);
      return;
    }

    openFlyout(event.currentTarget, menu);
  };

  const handleFlyoutClose = () => {
    setSubMenuFlyout(null);
  };

  const handleFlyoutMenuClick = (menu: MenuTreeNode) => {
    onMenuClick(menu);
    handleFlyoutClose();
  };

  return (
    <StyledSidebarRailContainer
      direction="column"
      onMouseLeave={handleFlyoutClose}
    >
      {menus?.map((menu) => (
        <StyledSidebarRailWrapper
          key={menu.menuId}
          selected={isMenuActive(menu)}
          onMouseEnter={(event) => handleRailItemEnter(event, menu)}
        >
          <IconButton
            iconName={
              isIconName(menu.iconName) ? menu.iconName : "AppsOutlined"
            }
            tooltip={
              hasSubMenus(menu)
                ? undefined
                : { message: menu.menuName, placement: "right" }
            }
            onClick={(event) => handleRailItemClick(event, menu)}
          />
        </StyledSidebarRailWrapper>
      ))}
      <SidebarFlyout
        open={!!subMenuFlyout}
        anchorEl={subMenuFlyout?.anchorEl}
        menu={subMenuFlyout?.menu}
        onMenuClick={handleFlyoutMenuClick}
        onClose={handleFlyoutClose}
      />
    </StyledSidebarRailContainer>
  );
}

const StyledSidebarRailContainer = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(2, 0),

  alignItems: "center",
  gap: theme.spacing(0.25),
  overflowY: "auto",
  scrollbarWidth: "none",

  "&::-webkit-scrollbar": {
    display: "none",
  },
}));

const StyledSidebarRailWrapper = styled(Flex, {
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
      backgroundColor: selected
        ? theme.palette.navigation.activeBackground
        : alpha(theme.palette.navigation.text, 0.1),
      color: theme.palette.navigation.activeText,
    },

    "& .MuiSvgIcon-root": {
      fontSize: 20,
    },
  },
}));
