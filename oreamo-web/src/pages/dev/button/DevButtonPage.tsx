import { useState } from "react";

import { styled } from "@mui/material";

import { Button } from "@/components/common/button/Button";
import { IconButton } from "@/components/common/button/IconButton";
import { Switch } from "@/components/common/button/Switch";
import { Toggle, ToggleOptions } from "@/components/common/button/Toggle";
import { Icon } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { PageLayout } from "@/pages/_components/PageLayout";
import { DevCardGrid } from "@/pages/dev/_components/DevCardGrid";
import { DevComponentCard } from "@/pages/dev/_components/DevComponentCard";

const BUTTON_VARIANTS = [
  { variant: "contained", title: "Contained Button" },
  { variant: "outlined", title: "Outlined Button" },
  { variant: "text", title: "Text Button" },
] as const;
const SIZES = ["small", "medium", "large"] as const;

const TOGGLE_OPTIONS: ToggleOptions[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

const TOGGLE_ICON_OPTIONS: ToggleOptions[] = [
  { value: "left", label: <Icon iconName="FormatAlignLeft" size="small" /> },
  {
    value: "center",
    label: <Icon iconName="FormatAlignCenter" size="small" />,
  },
  { value: "right", label: <Icon iconName="FormatAlignRight" size="small" /> },
];

export function DevButtonPage() {
  const [toggleValue, setToggleValue] = useState<string | undefined>("apple");
  const [toggleIconValue, setToggleIconValue] = useState<string | undefined>(
    "left",
  );
  const [switchChecked, setSwitchChecked] = useState(true);

  const handleToggleChange = (value?: string) => {
    setToggleValue(value);
  };

  const handleToggleIconChange = (value?: string) => {
    setToggleIconValue(value);
  };

  const handleSwitchChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  return (
    <PageLayout>
      <DevCardGrid>
        {BUTTON_VARIANTS.map(({ variant, title }) => (
          <DevComponentCard key={variant} title={title}>
            <StyledVariantContainer gap={6} align="center" wrap>
              <StyledLabelContainer direction="column">
                <Text size="xs" color="secondary">
                  size
                </Text>
              </StyledLabelContainer>
              <Flex gap={3} align="center" wrap>
                {SIZES.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    {size}
                  </Button>
                ))}
              </Flex>
            </StyledVariantContainer>
            <StyledVariantContainer gap={6} align="center" wrap>
              <StyledLabelContainer direction="column">
                <Text size="xs" color="secondary">
                  state
                </Text>
              </StyledLabelContainer>
              <Flex gap={3} align="center" wrap>
                <Button variant={variant}>Default</Button>
                <Button variant={variant} disabled>
                  Disabled
                </Button>
                <Button variant={variant} loading>
                  Loading
                </Button>
              </Flex>
            </StyledVariantContainer>
            <StyledVariantContainer gap={6} align="center" wrap>
              <StyledLabelContainer direction="column">
                <Text size="xs" color="secondary">
                  tooltip
                </Text>
              </StyledLabelContainer>
              <Flex gap={3} align="center" wrap>
                <Button
                  variant={variant}
                  tooltip={{ message: "This is a tooltip" }}
                >
                  Hover me
                </Button>
              </Flex>
            </StyledVariantContainer>
          </DevComponentCard>
        ))}

        <DevComponentCard title="Icon Button">
          <StyledVariantContainer gap={6} align="center" wrap>
            <StyledLabelContainer direction="column">
              <Text size="xs" color="secondary">
                size
              </Text>
            </StyledLabelContainer>
            <Flex gap={3} align="center" wrap>
              {SIZES.map((size) => (
                <IconButton key={size} iconName="Edit" size={size} />
              ))}
            </Flex>
          </StyledVariantContainer>
          <StyledVariantContainer gap={6} align="center" wrap>
            <StyledLabelContainer direction="column">
              <Text size="xs" color="secondary">
                outlined
              </Text>
            </StyledLabelContainer>
            <Flex gap={3} align="center" wrap>
              {SIZES.map((size) => (
                <IconButton
                  key={size}
                  iconName="Edit"
                  size={size}
                  variant="outlined"
                />
              ))}
            </Flex>
          </StyledVariantContainer>
          <StyledVariantContainer gap={6} align="center" wrap>
            <StyledLabelContainer direction="column">
              <Text size="xs" color="secondary">
                state
              </Text>
            </StyledLabelContainer>
            <Flex gap={3} align="center" wrap>
              <IconButton iconName="Search" />
              <IconButton iconName="Search" disabled />
              <IconButton iconName="Add" variant="outlined" />
              <IconButton iconName="Delete" variant="outlined" disabled />
            </Flex>
          </StyledVariantContainer>
          <StyledVariantContainer gap={6} align="center" wrap>
            <StyledLabelContainer direction="column">
              <Text size="xs" color="secondary">
                tooltip
              </Text>
            </StyledLabelContainer>
            <Flex gap={3} align="center" wrap>
              <IconButton
                iconName="Info"
                tooltip={{ message: "This is a tooltip" }}
              />
            </Flex>
          </StyledVariantContainer>
        </DevComponentCard>

        <DevComponentCard title="Toggle">
          <StyledVariantContainer gap={6} align="center" wrap>
            <StyledLabelContainer direction="column">
              <Text size="xs" color="secondary">
                label
              </Text>
            </StyledLabelContainer>
            <Flex gap={3} align="center" wrap>
              <Toggle
                options={TOGGLE_OPTIONS}
                value={toggleValue}
                onChange={handleToggleChange}
              />
            </Flex>
          </StyledVariantContainer>
          <StyledVariantContainer gap={6} align="center" wrap>
            <StyledLabelContainer direction="column">
              <Text size="xs" color="secondary">
                icon
              </Text>
            </StyledLabelContainer>
            <Flex gap={3} align="center" wrap>
              <Toggle
                options={TOGGLE_ICON_OPTIONS}
                value={toggleIconValue}
                onChange={handleToggleIconChange}
              />
            </Flex>
          </StyledVariantContainer>
        </DevComponentCard>

        <DevComponentCard title="Switch">
          <StyledVariantContainer gap={6} align="center" wrap>
            <StyledLabelContainer direction="column">
              <Text size="xs" color="secondary">
                state
              </Text>
            </StyledLabelContainer>
            <Flex gap={3} align="center" wrap>
              <Switch
                checked={switchChecked}
                label="Switch"
                onChange={handleSwitchChange}
              />
            </Flex>
          </StyledVariantContainer>
        </DevComponentCard>
      </DevCardGrid>
    </PageLayout>
  );
}

const StyledVariantContainer = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(3, 4),

  borderRadius: theme.shape.borderRadiusScale.md,

  "&:hover": {
    backgroundColor: theme.palette.scale[50],
  },
}));

const StyledLabelContainer = styled(Flex)(() => ({
  width: 80,
  minWidth: 80,
}));
