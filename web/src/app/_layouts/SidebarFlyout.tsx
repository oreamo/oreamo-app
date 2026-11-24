import { ListItemButton, ListItemText, styled } from "@mui/material";

import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { Popper } from "@/components/common/overlay/Popper";
import { useMenuMatch } from "@/hooks/useMenuMatch";
import { MenuTreeNode } from "@/models/menu-model";

interface SidebarFlyoutProps {
  open: boolean;
  anchorEl?: HTMLElement | null;
  menu?: MenuTreeNode;
  onMenuClick: (menu: MenuTreeNode) => void;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SidebarFlyout({
  open,
  anchorEl,
  menu,
  onMenuClick,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: SidebarFlyoutProps) {
  const { isMenuActive } = useMenuMatch();

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <StyledSidebarFlyoutContainer direction="column">
        <StyledSidebarFlyoutTitle>
          <Text size="xs" weight="bold" color="secondary">
            {menu?.menuName}
          </Text>
        </StyledSidebarFlyoutTitle>
        {menu?.subMenus?.map((subMenu) => (
          <StyledSidebarFlyoutMenuButton
            key={subMenu.menuId}
            selected={isMenuActive(subMenu)}
            onClick={() => onMenuClick(subMenu)}
          >
            <ListItemText
              primary={subMenu.menuName}
              slotProps={{
                primary: { fontSize: 13, fontWeight: 500, color: "inherit" },
              }}
            />
          </StyledSidebarFlyoutMenuButton>
        ))}
      </StyledSidebarFlyoutContainer>
    </Popper>
  );
}

const StyledSidebarFlyoutContainer = styled(Flex)(({ theme }) => ({
  minWidth: 160,
  marginLeft: theme.spacing(1),
  padding: theme.spacing(1),

  border: `1px solid ${theme.palette.navigation.activeBackground}`,
  borderRadius: theme.shape.borderRadiusScale.md,

  backgroundColor: theme.palette.navigation.background,
  color: theme.palette.navigation.text,
  boxShadow: theme.shadowScale.md,
}));

const StyledSidebarFlyoutTitle = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),

  color: theme.palette.navigation.text,
}));

const StyledSidebarFlyoutMenuButton = styled(ListItemButton)(({ theme }) => ({
  minHeight: 28,
  padding: theme.spacing(0.5, 1),

  borderRadius: theme.shape.borderRadiusScale.sm,
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
