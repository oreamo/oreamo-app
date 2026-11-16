import { ReactNode } from "react";

import { Card } from "@/components/common/display/Card";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";

export interface DevComponentCardProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DevComponentCard({
  title,
  actions,
  children,
}: DevComponentCardProps) {
  return (
    <Card>
      <Flex gap={1} align="center" justify="between">
        <Text weight="semibold">{title}</Text>
        {actions}
      </Flex>
      {children}
    </Card>
  );
}
