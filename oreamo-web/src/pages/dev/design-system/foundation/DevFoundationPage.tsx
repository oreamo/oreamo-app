import { useState } from "react";

import { styled } from "@mui/material";

import { Switch } from "@/components/common/button/Switch";
import { Text, TextProps } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import {
  BORDER_RADIUS,
  BREAKPOINTS,
  PALETTE,
  SHADOW,
  SPACING,
} from "@/constants/foundation-constant";
import { PageLayout } from "@/pages/_components/PageLayout";
import { DevCardGrid } from "@/pages/dev/_components/DevCardGrid";
import { DevComponentCard } from "@/pages/dev/_components/DevComponentCard";

const TYPOGRAPHY_SAMPLE_TEXT = "This is an example.";

const TEXT_SIZES: TextProps["size"][] = ["xs", "sm", "md", "lg", "xl"];

const TEXT_WEIGHTS: TextProps["weight"][] = [
  "light",
  "regular",
  "medium",
  "semibold",
  "bold",
];

const BREAKPOINT_MAX_WIDTH = BREAKPOINTS.desktop + 320;

const PALETTE_GROUPS = ["scale", "surface", "navigation", "brand"] as const;

export function DevFoundationPage() {
  const [isDarkPalette, setIsDarkPalette] = useState(false);

  const handlePaletteModeChange = (checked: boolean) => {
    setIsDarkPalette(checked);
  };

  const palette = isDarkPalette ? PALETTE.dark : PALETTE.light;

  return (
    <PageLayout>
      <DevCardGrid>
        <DevComponentCard
          title="Palette"
          actions={
            <Switch
              label="dark"
              checked={isDarkPalette}
              onChange={handlePaletteModeChange}
            />
          }
        >
          <StyledPalettePreviewContainer
            direction="column"
            gap={3}
            backgroundColor={palette.surface.raised}
            color={palette.scale[800]}
          >
            {PALETTE_GROUPS.map((group) => (
              <Flex direction="column" gap={1.5} key={group}>
                <Text size="sm" weight="medium" color="inherit">
                  {group}
                </Text>
                <Flex gap={4} wrap>
                  {(Object.entries(palette[group]) as [string, string][]).map(
                    ([key, value]) => (
                      <Flex direction="column" gap={1} align="center" key={key}>
                        <StyledColorSample
                          backgroundColor={value}
                          borderColor={palette.scale[200]}
                        />
                        <Text size="xs" color="inherit">
                          {key}
                        </Text>
                        <Text size="xs" color="inherit">
                          {value}
                        </Text>
                      </Flex>
                    ),
                  )}
                </Flex>
              </Flex>
            ))}
          </StyledPalettePreviewContainer>
        </DevComponentCard>

        <DevComponentCard title="Text">
          <Flex direction="column" gap={0.5}>
            {TEXT_SIZES.map((size) => (
              <StyledSectionWrapper gap={4} align="center" wrap key={size}>
                <StyledSectionGroup direction="column" gap={0.5}>
                  <Text size="xs" color="secondary">
                    {size}
                  </Text>
                </StyledSectionGroup>
                <Text size={size} breakWord>
                  {TYPOGRAPHY_SAMPLE_TEXT}
                </Text>
              </StyledSectionWrapper>
            ))}
            {TEXT_WEIGHTS.map((weight) => (
              <StyledSectionWrapper gap={4} align="center" wrap key={weight}>
                <StyledSectionGroup direction="column" gap={0.5}>
                  <Text size="xs" color="secondary">
                    {weight}
                  </Text>
                </StyledSectionGroup>
                <Text weight={weight} breakWord>
                  {TYPOGRAPHY_SAMPLE_TEXT}
                </Text>
              </StyledSectionWrapper>
            ))}
          </Flex>
        </DevComponentCard>

        <DevComponentCard title="Spacing">
          <Flex direction="column" gap={0.5}>
            {(Object.entries(SPACING) as [string, number][]).map(
              ([key, value]) => (
                <StyledSectionWrapper gap={4} align="center" wrap key={key}>
                  <StyledSectionGroup direction="column" gap={0.5}>
                    <Text size="xs" color="secondary">
                      {key}
                    </Text>
                    <Text size="xs" color="disabled">
                      {value}px
                    </Text>
                  </StyledSectionGroup>
                  <StyledSpacingSample width={value} />
                </StyledSectionWrapper>
              ),
            )}
          </Flex>
        </DevComponentCard>

        <DevComponentCard title="Breakpoint">
          <Flex direction="column" gap={0.5}>
            {(Object.entries(BREAKPOINTS) as [string, number][]).map(
              ([key, value]) => (
                <StyledSectionWrapper gap={4} align="center" wrap key={key}>
                  <StyledSectionGroup direction="column" gap={0.5}>
                    <Text size="xs" color="secondary">
                      {key}
                    </Text>
                    <Text size="xs" color="disabled">
                      {value}px
                    </Text>
                  </StyledSectionGroup>
                  <StyledBreakpointTrack align="center" grow>
                    <StyledBreakpointSample
                      width={`${(value / BREAKPOINT_MAX_WIDTH) * 100}%`}
                    />
                  </StyledBreakpointTrack>
                </StyledSectionWrapper>
              ),
            )}
          </Flex>
        </DevComponentCard>

        <DevComponentCard title="Border Radius">
          <Flex direction="column" gap={0.5}>
            {(Object.entries(BORDER_RADIUS) as [string, number][]).map(
              ([key, value]) => (
                <StyledSectionWrapper gap={4} align="center" wrap key={key}>
                  <StyledSectionGroup direction="column" gap={0.5}>
                    <Text size="xs" color="secondary">
                      {key}
                    </Text>
                    <Text size="xs" color="disabled">
                      {value}px
                    </Text>
                  </StyledSectionGroup>
                  <StyledRadiusSample borderRadius={value} />
                </StyledSectionWrapper>
              ),
            )}
          </Flex>
        </DevComponentCard>

        <DevComponentCard title="Shadow">
          <Flex direction="column" gap={0.5}>
            {(Object.entries(SHADOW) as [string, string][]).map(
              ([key, value]) => (
                <StyledSectionWrapper gap={4} align="center" wrap key={key}>
                  <StyledSectionGroup direction="column" gap={0.5}>
                    <Text size="xs" color="secondary">
                      {key}
                    </Text>
                  </StyledSectionGroup>
                  <StyledShadowSample boxShadow={value} />
                </StyledSectionWrapper>
              ),
            )}
          </Flex>
        </DevComponentCard>
      </DevCardGrid>
    </PageLayout>
  );
}

const StyledSectionWrapper = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(2, 3),

  borderRadius: theme.shape.borderRadiusScale.md,

  "&:hover": {
    backgroundColor: theme.palette.scale[50],
  },
}));

const StyledSectionGroup = styled(Flex)({
  width: 80,
  minWidth: 80,
});

const StyledPalettePreviewContainer = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "backgroundColor" && prop !== "color",
})<{ backgroundColor: string; color: string }>(
  ({ theme, backgroundColor, color }) => ({
    padding: theme.spacing(3),

    borderRadius: theme.shape.borderRadiusScale.md,

    backgroundColor,
    color,
  }),
);

const StyledColorSample = styled(Flex, {
  shouldForwardProp: (prop) =>
    prop !== "backgroundColor" && prop !== "borderColor",
})<{ backgroundColor: string; borderColor: string }>(
  ({ theme, backgroundColor, borderColor }) => ({
    width: 56,
    height: 56,

    border: `1px solid ${borderColor}`,
    borderRadius: theme.shape.borderRadiusScale.md,

    backgroundColor,
  }),
);

const StyledSpacingSample = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "width",
})<{ width: number }>(({ theme, width }) => ({
  width,
  height: theme.spacing(6),
  minWidth: theme.spacing(1),

  borderRadius: theme.shape.borderRadiusScale.sm,

  backgroundColor: theme.palette.scale[400],
}));

const StyledBreakpointTrack = styled(Flex)(({ theme }) => ({
  height: theme.spacing(6),

  position: "relative",

  borderRadius: theme.shape.borderRadiusScale.sm,

  backgroundColor: theme.palette.scale[100],
}));

const StyledBreakpointSample = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "width",
})<{ width: string }>(({ theme, width }) => ({
  width,
  height: "100%",
  minWidth: theme.spacing(1),

  borderRadius: theme.shape.borderRadiusScale.sm,

  backgroundColor: theme.palette.scale[400],
}));

const StyledRadiusSample = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "borderRadius",
})<{ borderRadius: number }>(({ theme, borderRadius }) => ({
  width: 64,
  height: 40,

  border: `1px solid ${theme.palette.scale[400]}`,
  borderRadius,

  backgroundColor: theme.palette.scale[300],
}));

const StyledShadowSample = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "boxShadow",
})<{ boxShadow: string }>(({ theme, boxShadow }) => ({
  width: 96,
  height: 48,

  borderRadius: theme.shape.borderRadiusScale.md,

  backgroundColor: theme.palette.background.paper,
  boxShadow,
}));
