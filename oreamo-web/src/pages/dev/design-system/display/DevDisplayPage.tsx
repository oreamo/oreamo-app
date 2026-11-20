import { Badge } from "@/components/common/display/Badge";
import { Breadcrumb } from "@/components/common/display/Breadcrumb";
import { Callout } from "@/components/common/display/Callout";
import { Card } from "@/components/common/display/Card";
import { Chip } from "@/components/common/display/Chip";
import { Icon } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { PageLayout } from "@/pages/_components/PageLayout";
import { DevCardGrid } from "@/pages/dev/_components/DevCardGrid";
import { DevComponentCard } from "@/pages/dev/_components/DevComponentCard";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const CHIP_SIZES = ["small", "medium"] as const;
const CALLOUT_TYPES = ["info", "success", "warning", "error"] as const;

export function DevDisplayPage() {
  const handleChipClick = () => {};

  const handleChipDelete = () => {};

  return (
    <PageLayout>
      <DevCardGrid>
        <DevComponentCard title="Icon">
          <Flex gap={4} align="center">
            {SIZES.map((size) => (
              <Flex direction="column" gap={1} align="center" key={size}>
                <Icon iconName="Favorite" size={size} />
                <Text size="xs" color="secondary">
                  {size}
                </Text>
              </Flex>
            ))}
          </Flex>
        </DevComponentCard>

        <DevComponentCard title="Card">
          <Card>
            <Text size="sm">This is the card content area.</Text>
          </Card>
        </DevComponentCard>

        <DevComponentCard title="Chip">
          <Flex gap={1} align="center" wrap>
            {CHIP_SIZES.map((size) => (
              <Chip key={size} label={size} size={size} />
            ))}
          </Flex>
          <Flex gap={1} align="center" wrap>
            <Chip label="Default" size="small" />
            <Chip label="Primary" size="small" color="primary" />
            <Chip label="Clickable" size="small" onClick={handleChipClick} />
            <Chip label="Deletable" size="small" onDelete={handleChipDelete} />
            <Chip label="Disabled" size="small" disabled />
          </Flex>
        </DevComponentCard>

        <DevComponentCard title="Badge">
          <Flex gap={4} align="center" wrap>
            <Badge content={4}>
              <Icon iconName="Notifications" />
            </Badge>
            <Badge content={120} max={99}>
              <Icon iconName="Notifications" />
            </Badge>
            <Badge content={4} color="error">
              <Icon iconName="Notifications" />
            </Badge>
            <Badge content={4} color="default">
              <Icon iconName="Notifications" />
            </Badge>
            <Badge variant="dot">
              <Icon iconName="Notifications" />
            </Badge>
          </Flex>
        </DevComponentCard>

        <DevComponentCard title="Callout">
          <Flex direction="column" gap={2}>
            {CALLOUT_TYPES.map((type) => (
              <Callout key={type} type={type}>
                This is the {type} callout message.
              </Callout>
            ))}
            <Callout type="error" title="Sign in failed">
              The username or password is incorrect.
            </Callout>
          </Flex>
        </DevComponentCard>

        <DevComponentCard title="Breadcrumb">
          <Breadcrumb items={["Dev", "Display", "Breadcrumb"]} />
        </DevComponentCard>
      </DevCardGrid>
    </PageLayout>
  );
}
