import { ReactNode } from "react";

import { styled } from "@mui/material";

import { Breadcrumb } from "@/components/common/display/Breadcrumb";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { useMenuMatch } from "@/hooks/useMenuMatch";
import { useMenuTree } from "@/resources/menu/useMenuTree";

interface PageLayoutProps {
  className?: string;
  title?: string;
  children: ReactNode;
}

interface PageLayoutRowProps {
  children: ReactNode;
}

interface PageLayoutColumnProps {
  children: ReactNode;
}

export function PageLayout({ className, title, children }: PageLayoutProps) {
  const { data: menuTreeNodes } = useMenuTree();
  const { findCurrentMenu, findCurrentMenuPath } = useMenuMatch();

  const pageTitle = title ?? findCurrentMenu(menuTreeNodes)?.menuName;
  const breadcrumbItems = findCurrentMenuPath(menuTreeNodes).map(
    (menu) => menu.menuName,
  );

  return (
    <Flex direction="column" gap={2} className={`page ${className}`}>
      {pageTitle ? (
        <StyledTitleContainer gap={2} align="center" justify="between">
          <Text size="xl" weight="semibold" color="primary">
            {pageTitle}
          </Text>
          {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}
        </StyledTitleContainer>
      ) : null}
      {children}
    </Flex>
  );
}

function PageLayoutRow({ children }: PageLayoutRowProps) {
  return <Flex gap={2}>{children}</Flex>;
}

function PageLayoutColumn({ children }: PageLayoutColumnProps) {
  return (
    <Flex direction="column" gap={2} grow>
      {children}
    </Flex>
  );
}

PageLayout.Row = PageLayoutRow;
PageLayout.Column = PageLayoutColumn;

const StyledTitleContainer = styled(Flex)(({ theme }) => ({
  paddingBottom: theme.spacing(1.5),
}));
