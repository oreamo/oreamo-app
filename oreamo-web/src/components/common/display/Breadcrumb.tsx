import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";

import { Icon } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";

export interface BreadcrumbProps {
  items: string[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const parentItems = items.slice(0, -1);
  const currentItem = items.at(-1);

  return (
    <MuiBreadcrumbs separator={<Icon iconName="NavigateNext" size="small" />}>
      {parentItems.map((item, index) => (
        <Text key={`breadcrumb-item-${index}`} size="sm" color="secondary">
          {item}
        </Text>
      ))}
      {currentItem && (
        <Text size="sm" color="primary">
          {currentItem}
        </Text>
      )}
    </MuiBreadcrumbs>
  );
}
