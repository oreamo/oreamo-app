import { useState } from "react";

import { styled } from "@mui/material";

import { useMenuTabOpenEffect } from "@/app/_hooks/useMenuTabOpenEffect";
import { Header } from "@/app/_layouts/Header";
import { MenuList } from "@/app/_layouts/MenuList";
import { MenuTabBar } from "@/app/_layouts/MenuTabBar";
import { MenuTabOutlet } from "@/app/_layouts/MenuTabOutlet";
import { Sidebar } from "@/app/_layouts/Sidebar";
import { Flex } from "@/components/common/layout/Flex";
import { useMedia } from "@/hooks/useMedia";
import { useMenuMatch } from "@/hooks/useMenuMatch";
import { MenuTreeNode } from "@/models/menu-model";
import { useMenuTree } from "@/resources/menu/useMenuTree";
import { useMenuTabEnabled, useMenuTabs } from "@/stores/menu-tab-store";

export function AppLayout() {
  const { isDesktop } = useMedia();

  const isMenuTabEnabled = useMenuTabEnabled();
  const menuTabs = useMenuTabs();

  const { data: menuTreeNodes } = useMenuTree();
  const { isMenuActive } = useMenuMatch();

  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [isMenuListOpen, setIsMenuListOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useMenuTabOpenEffect({ enabled: isDesktop && isMenuTabEnabled });

  const routeActiveMenu = menuTreeNodes?.find(isMenuActive);

  const activeMenu =
    menuTreeNodes?.find((menu) => menu.menuId === selectedMenuId) ??
    routeActiveMenu;

  const handleActiveMenuChange = (menu: MenuTreeNode) => {
    setSelectedMenuId(menu.menuId);
  };

  const handleMenuTabChange = () => {
    setSelectedMenuId(null);
  };

  const handleMenuListToggle = () => {
    setIsMenuListOpen((prev) => !prev);
  };

  const handleMenuListClose = () => {
    setIsMenuListOpen(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const hasSubMenus = (activeMenu?.subMenus?.length ?? 0) > 0;
  const showSidebar = hasSubMenus && isDesktop;
  const showMenuList = isMenuListOpen && !isDesktop;
  const showMenuTabBar = menuTabs.length > 0 && isDesktop;

  return (
    <StyledAppLayoutContainer
      direction="column"
      className="layout"
      fullWidth
      fullHeight
    >
      <Header
        onActiveMenuChange={handleActiveMenuChange}
        isMenuListOpen={showMenuList}
        onMenuButtonClick={handleMenuListToggle}
      />
      <StyledAppLayoutWrapper gap={3} grow>
        {showSidebar && (
          <Sidebar
            activeMenu={activeMenu}
            open={isSidebarOpen}
            onToggle={handleSidebarToggle}
          />
        )}
        <Flex direction="column" grow>
          {showMenuTabBar && <MenuTabBar onTabChange={handleMenuTabChange} />}
          <StyledAppLayoutGroup
            direction="column"
            hasMenuTabBar={showMenuTabBar}
            grow
          >
            <StyledAppLayoutItem direction="column" className="main" grow>
              <MenuTabOutlet />
            </StyledAppLayoutItem>
          </StyledAppLayoutGroup>
        </Flex>
        <MenuList
          open={showMenuList}
          onClose={handleMenuListClose}
          onActiveMenuChange={handleActiveMenuChange}
        />
      </StyledAppLayoutWrapper>
    </StyledAppLayoutContainer>
  );
}

const StyledAppLayoutContainer = styled(Flex)({
  backgroundColor: "transparent",
});

const StyledAppLayoutWrapper = styled(Flex)(({ theme }) => ({
  position: "relative",

  padding: theme.spacing(3),
  paddingTop: 0,
}));

const StyledAppLayoutGroup = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "hasMenuTabBar",
})<{ hasMenuTabBar: boolean }>(({ theme, hasMenuTabBar }) => ({
  padding: theme.spacing(2),

  overflow: "hidden",
  borderRadius: theme.shape.borderRadiusScale.lg,
  ...(hasMenuTabBar && { borderTopLeftRadius: 0 }),

  backgroundColor: theme.palette.surface.subtle,
}));

const StyledAppLayoutItem = styled(Flex)(({ theme }) => ({
  overflow: "auto",
  borderRadius: theme.shape.borderRadiusScale.lg,
}));
