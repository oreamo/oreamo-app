import { ReactNode } from "react";

import { styled } from "@mui/material";
import { Outlet } from "react-router";

import { Flex } from "@/components/common/layout/Flex";

interface GlobalLayoutProps {
  children?: ReactNode;
}

export function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <StyledGlobalLayoutContainer direction="column">
      {children ?? <Outlet />}
    </StyledGlobalLayoutContainer>
  );
}

const StyledGlobalLayoutContainer = styled(Flex)(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  minWidth: theme.breakpoints.values.phone,

  overflow: "hidden",

  backgroundColor: theme.palette.surface.default,
}));
