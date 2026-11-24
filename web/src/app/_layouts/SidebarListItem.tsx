import { alpha, ListItemButton, ListItemText, styled } from "@mui/material";

import { useMenuMatch } from "@/hooks/useMenuMatch";
import { MenuTreeNode } from "@/models/menu-model";

interface SidebarListItemProps {
  menu: MenuTreeNode;
  onMenuClick: (menu: MenuTreeNode) => void;
}

export function SidebarListItem({ menu, onMenuClick }: SidebarListItemProps) {
  const { isMenuActive } = useMenuMatch();

  const handleClick = () => {
    onMenuClick(menu);
  };

  return (
    <StyledMenuButton selected={isMenuActive(menu)} onClick={handleClick}>
      <ListItemText
        primary={menu.menuName}
        slotProps={{
          primary: { fontSize: 14, fontWeight: 500, color: "inherit" },
        }}
      />
    </StyledMenuButton>
  );
}

const StyledMenuButton = styled(ListItemButton)(({ theme }) => ({
  minHeight: 32,
  padding: theme.spacing(0.75, 1.5),

  borderRadius: theme.shape.borderRadiusScale.md,
  color: theme.palette.navigation.text,

  "&:hover": {
    backgroundColor: alpha(theme.palette.navigation.text, 0.1),
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
