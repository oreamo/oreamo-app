import { styled } from "@mui/material";
import { useLocation } from "react-router";

import { MenuTab } from "@/app/_layouts/MenuTab";
import { IconButton } from "@/components/common/button/IconButton";
import { Flex } from "@/components/common/layout/Flex";
import { ROUTE } from "@/constants/route-constant";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useNavigator } from "@/hooks/useNavigator";
import { useTranslate } from "@/hooks/useTranslate";
import {
  MenuTabItem,
  useMenuTabActions,
  useMenuTabs,
} from "@/stores/menu-tab-store";

interface MenuTabBarProps {
  onTabChange: () => void;
}

export function MenuTabBar({ onTabChange }: MenuTabBarProps) {
  const { pathname } = useLocation();
  const { navigate } = useNavigator();

  const tabs = useMenuTabs();
  const { close, closeOthers, refresh } = useMenuTabActions();

  const { translate } = useTranslate();

  const isTabActive = (tab: MenuTabItem) => {
    return tab.url === pathname;
  };

  const handleTabClick = (tab: MenuTabItem) => {
    onTabChange();
    navigate(tab.url);
  };

  const handleTabClose = (tab: MenuTabItem) => {
    close(tab.url);

    if (!isTabActive(tab)) return;

    const tabIndex = tabs.findIndex((prevTab) => prevTab.url === tab.url);
    const nextTab = tabs[tabIndex + 1] ?? tabs[tabIndex - 1];

    onTabChange();
    navigate(nextTab?.url ?? ROUTE.MAIN.URL);
  };

  const handleCloseOthersClick = () => {
    closeOthers(pathname);
  };

  const isTabClosable = tabs.length > 1;

  return (
    <StyledMenuTabBarContainer gap={0.5} align="end">
      {tabs.map((tab) => (
        <MenuTab
          key={tab.url}
          label={tab.menuName}
          active={isTabActive(tab)}
          closable={isTabClosable}
          onClick={() => handleTabClick(tab)}
          onRefresh={() => refresh(tab.url)}
          onClose={() => handleTabClose(tab)}
        />
      ))}
      {isTabClosable && (
        <StyledMenuTabBarWrapper align="center">
          <IconButton
            iconName="CloseOutlined"
            variant="outlined"
            size="small"
            tooltip={{
              message: translate(TRANSLATION_KEY.menu.label.CLOSE_OTHERS),
              placement: "left",
            }}
            onClick={handleCloseOthersClick}
          />
        </StyledMenuTabBarWrapper>
      )}
    </StyledMenuTabBarContainer>
  );
}

const StyledMenuTabBarContainer = styled(Flex)({
  flexShrink: 0,
  overflowX: "auto",
  scrollbarWidth: "none",

  "&::-webkit-scrollbar": {
    display: "none",
  },
});

const StyledMenuTabBarWrapper = styled(Flex)(({ theme }) => ({
  marginLeft: theme.spacing(1),

  flexShrink: 0,
  alignSelf: "center",
  position: "sticky",
  right: 0,

  backgroundColor: theme.palette.surface.default,
}));
