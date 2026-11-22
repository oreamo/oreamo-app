import { useMediaQuery, useTheme } from "@mui/material";

export function useMedia() {
  const theme = useTheme();

  const isPhone = useMediaQuery(theme.breakpoints.down("tablet"));
  const isTablet = useMediaQuery(
    theme.breakpoints.between("tablet", "desktop"),
  );
  const isDesktop = useMediaQuery(theme.breakpoints.up("desktop"));
  const isMobile = !isDesktop;

  return {
    isPhone,
    isTablet,
    isMobile,
    isDesktop,
  };
}
