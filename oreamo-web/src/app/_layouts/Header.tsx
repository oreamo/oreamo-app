import { AppBar, styled, Toolbar } from "@mui/material";

import { UserProfile } from "@/app/_layouts/UserProfile";
import { Button } from "@/components/common/button/Button";
import { Flex } from "@/components/common/layout/Flex";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useMedia } from "@/hooks/useMedia";
import { useNavigator } from "@/hooks/useNavigator";
import { useTranslate } from "@/hooks/useTranslate";
import { MenuTreeNode } from "@/models/menu-model";
import { useMenuTree } from "@/resources/menu/useMenuTree";

interface HeaderProps {
  onActiveMenuChange: (menu: MenuTreeNode) => void;
  isMenuListOpen: boolean;
  onMenuButtonClick: () => void;
}

export function Header({
  onActiveMenuChange,
  isMenuListOpen,
  onMenuButtonClick,
}: HeaderProps) {
  const { navigate } = useNavigator();

  const { isDesktop } = useMedia();
  const { data: menuTreeNodes } = useMenuTree();
  const { translate } = useTranslate();

  const handleMenuClick = (menu: MenuTreeNode) => {
    onActiveMenuChange(menu);

    const firstSubMenu = menu.subMenus?.[0];

    if (firstSubMenu?.url) {
      navigate(firstSubMenu.url);
    } else if (menu.url) {
      navigate(menu.url);
    }
  };

  return (
    <StyledHeaderContainer position="static">
      <StyledHeaderWrapper variant="dense" disableGutters>
        {isDesktop ? (
          <Flex gap={0.5} align="center">
            {menuTreeNodes?.map((menu) => (
              <Button key={menu.menuId} onClick={() => handleMenuClick(menu)}>
                {menu.menuName}
              </Button>
            ))}
          </Flex>
        ) : (
          <Button
            startIconName={isMenuListOpen ? "Close" : "Menu"}
            onClick={onMenuButtonClick}
          >
            {translate(TRANSLATION_KEY.menu.label.MENU)}
          </Button>
        )}
        <UserProfile />
      </StyledHeaderWrapper>
    </StyledHeaderContainer>
  );
}

const StyledHeaderContainer = styled(AppBar)(({ theme }) => ({
  color: theme.palette.text.primary,

  boxShadow: "none",

  backgroundColor: theme.palette.surface.default,
}));

const StyledHeaderWrapper = styled(Toolbar)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),

  justifyContent: "space-between",
}));
