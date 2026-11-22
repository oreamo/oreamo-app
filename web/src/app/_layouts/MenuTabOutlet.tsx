import { ReactNode, useState } from "react";

import { styled } from "@mui/material";
import { useLocation, useOutlet } from "react-router";

import { Flex } from "@/components/common/layout/Flex";
import { useMenuTabRefreshKeys, useMenuTabs } from "@/stores/menu-tab-store";

export function MenuTabOutlet() {
  const outlet = useOutlet();
  const { pathname } = useLocation();

  const tabs = useMenuTabs();
  const refreshKeys = useMenuTabRefreshKeys();

  const [outlets, setOutlets] = useState<Record<string, ReactNode>>({});

  if (outlet && !outlets[pathname]) {
    setOutlets((prev) => ({ ...prev, [pathname]: outlet }));
  }

  const isOutletAlive = (url: string) => {
    return url === pathname || tabs.some((tab) => tab.url === url);
  };

  return Object.entries(outlets)
    .filter(([url]) => isOutletAlive(url))
    .map(([url, element]) => (
      <StyledMenuTabOutletContainer
        key={`${url}:${refreshKeys[url] ?? 0}`}
        direction="column"
        visible={url === pathname}
      >
        {element}
      </StyledMenuTabOutletContainer>
    ));
}

const StyledMenuTabOutletContainer = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "visible",
})<{ visible: boolean }>(({ visible }) => ({
  ...(!visible && { display: "none" }),
}));
