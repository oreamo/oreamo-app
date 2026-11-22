import { ChangeEvent, useState } from "react";

import { styled } from "@mui/material";

import { Switch } from "@/components/common/button/Switch";
import { Toggle, ToggleOptions } from "@/components/common/button/Toggle";
import { Text } from "@/components/common/display/Text";
import { NumberInput } from "@/components/common/input/NumberInput";
import { TextInput } from "@/components/common/input/TextInput";
import { Flex, FlexProps } from "@/components/common/layout/Flex";
import { Grid, GridColumns } from "@/components/common/layout/Grid";
import { PageLayout } from "@/pages/_components/PageLayout";
import { DevComponentCard } from "@/pages/dev/_components/DevComponentCard";

type FlexDirection = NonNullable<FlexProps["direction"]>;
type FlexAlign = NonNullable<FlexProps["align"]> | "none";
type FlexJustify = NonNullable<FlexProps["justify"]> | "none";

const DIRECTION_OPTIONS: ToggleOptions[] = [
  { value: "row", label: "row" },
  { value: "column", label: "column" },
];

const ALIGN_OPTIONS: ToggleOptions[] = [
  { value: "none", label: "none" },
  { value: "start", label: "start" },
  { value: "center", label: "center" },
  { value: "end", label: "end" },
];

const JUSTIFY_OPTIONS: ToggleOptions[] = [
  { value: "none", label: "none" },
  { value: "start", label: "start" },
  { value: "center", label: "center" },
  { value: "end", label: "end" },
  { value: "between", label: "between" },
];

const SAMPLE_HEIGHTS = [40, 64, 52];

export function DevLayoutPage() {
  const [flexDirection, setFlexDirection] = useState<FlexDirection>("row");
  const [flexAlign, setFlexAlign] = useState<FlexAlign>("none");
  const [flexJustify, setFlexJustify] = useState<FlexJustify>("none");
  const [flexGap, setFlexGap] = useState<number | "">(1);
  const [flexWrap, setFlexWrap] = useState(false);
  const [flexGrowFirst, setFlexGrowFirst] = useState(false);
  const [flexItemCount, setFlexItemCount] = useState<number | "">(3);
  const [gridColumns, setGridColumns] = useState<number | "">(3);
  const [gridResponsive, setGridResponsive] = useState(false);
  const [gridTabletColumns, setGridTabletColumns] = useState<number | "">(2);
  const [gridPhoneColumns, setGridPhoneColumns] = useState<number | "">(1);
  const [gridTemplate, setGridTemplate] = useState("");
  const [gridGap, setGridGap] = useState<number | "">(1);
  const [gridItemCount, setGridItemCount] = useState<number | "">(6);

  const toNumber = (value: number | "") => {
    return value === "" ? 0 : value;
  };

  const createItems = (count: number | "") => {
    return Array.from({ length: toNumber(count) }, (_, index) => index + 1);
  };

  const formatProps = (propTexts: (string | false)[]) => {
    return propTexts.filter(Boolean).join(" ");
  };

  const handleFlexDirectionChange = (value?: string) => {
    if (!value) return;

    setFlexDirection(value as FlexDirection);
  };

  const handleFlexAlignChange = (value?: string) => {
    if (!value) return;

    setFlexAlign(value as FlexAlign);
  };

  const handleFlexJustifyChange = (value?: string) => {
    if (!value) return;

    setFlexJustify(value as FlexJustify);
  };

  const handleFlexGapChange = (value: number | "") => {
    setFlexGap(value);
  };

  const handleFlexWrapChange = (checked: boolean) => {
    setFlexWrap(checked);
  };

  const handleFlexGrowFirstChange = (checked: boolean) => {
    setFlexGrowFirst(checked);
  };

  const handleFlexItemCountChange = (value: number | "") => {
    setFlexItemCount(value);
  };

  const handleGridColumnsChange = (value: number | "") => {
    setGridColumns(value);
  };

  const handleGridResponsiveChange = (checked: boolean) => {
    setGridResponsive(checked);
  };

  const handleGridTabletColumnsChange = (value: number | "") => {
    setGridTabletColumns(value);
  };

  const handleGridPhoneColumnsChange = (value: number | "") => {
    setGridPhoneColumns(value);
  };

  const handleGridTemplateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGridTemplate(event.target.value);
  };

  const handleGridGapChange = (value: number | "") => {
    setGridGap(value);
  };

  const handleGridItemCountChange = (value: number | "") => {
    setGridItemCount(value);
  };

  const flexItems = createItems(flexItemCount);
  const gridItems = createItems(gridItemCount);

  const flexCode = `<Flex ${formatProps([
    flexDirection !== "row" && `direction="${flexDirection}"`,
    `gap={${toNumber(flexGap)}}`,
    flexAlign !== "none" && `align="${flexAlign}"`,
    flexJustify !== "none" && `justify="${flexJustify}"`,
    flexWrap && "wrap",
  ])}>`;

  const toColumns = (value: number | "") => {
    return Math.max(toNumber(value), 1);
  };

  const gridColumnsValue: GridColumns = gridResponsive
    ? {
        desktop: toColumns(gridColumns),
        tablet: toColumns(gridTabletColumns),
        phone: toColumns(gridPhoneColumns),
      }
    : toColumns(gridColumns);

  const gridColumnsCode =
    typeof gridColumnsValue === "number"
      ? `columns={${gridColumnsValue}}`
      : `columns={{ desktop: ${gridColumnsValue.desktop}, tablet: ${gridColumnsValue.tablet}, phone: ${gridColumnsValue.phone} }}`;

  const gridCode = `<Grid ${formatProps([
    gridTemplate ? `template="${gridTemplate}"` : gridColumnsCode,
    `gap={${toNumber(gridGap)}}`,
  ])}>`;

  return (
    <PageLayout>
      <Flex direction="column" gap={4}>
        <DevComponentCard title="Flex">
          <Grid columns={{ desktop: 2, phone: 1 }} gap={4}>
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  direction
                </Text>
                <Toggle
                  size="small"
                  options={DIRECTION_OPTIONS}
                  value={flexDirection}
                  onChange={handleFlexDirectionChange}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  align
                </Text>
                <Toggle
                  size="small"
                  options={ALIGN_OPTIONS}
                  value={flexAlign}
                  onChange={handleFlexAlignChange}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  justify
                </Text>
                <Toggle
                  size="small"
                  options={JUSTIFY_OPTIONS}
                  value={flexJustify}
                  onChange={handleFlexJustifyChange}
                />
              </Flex>
              <Grid columns={2} gap={2}>
                <NumberInput
                  label="gap"
                  value={flexGap}
                  min={0}
                  max={10}
                  onChange={handleFlexGapChange}
                />
                <NumberInput
                  label="items"
                  value={flexItemCount}
                  min={0}
                  max={30}
                  onChange={handleFlexItemCountChange}
                />
              </Grid>
              <Flex gap={3} wrap>
                <Switch
                  label="wrap"
                  checked={flexWrap}
                  onChange={handleFlexWrapChange}
                />
                <Switch
                  label="grow (first item)"
                  checked={flexGrowFirst}
                  onChange={handleFlexGrowFirstChange}
                />
              </Flex>
            </Flex>
            <Flex direction="column" gap={2}>
              <StyledLayoutPreview>
                <Flex
                  direction={flexDirection}
                  gap={toNumber(flexGap)}
                  align={flexAlign === "none" ? undefined : flexAlign}
                  justify={flexJustify === "none" ? undefined : flexJustify}
                  wrap={flexWrap}
                >
                  {flexItems.map((item, index) =>
                    flexGrowFirst && index === 0 ? (
                      <Flex key={item} grow>
                        <StyledLayoutSample
                          align="center"
                          justify="center"
                          sampleHeight={SAMPLE_HEIGHTS[0]}
                        >
                          {`${item} (grow)`}
                        </StyledLayoutSample>
                      </Flex>
                    ) : (
                      <StyledLayoutSample
                        align="center"
                        justify="center"
                        key={item}
                        sampleHeight={
                          SAMPLE_HEIGHTS[index % SAMPLE_HEIGHTS.length]
                        }
                      >
                        {item}
                      </StyledLayoutSample>
                    ),
                  )}
                </Flex>
              </StyledLayoutPreview>
              <StyledLayoutCode>
                <Text size="sm" color="inherit">
                  {flexCode}
                </Text>
              </StyledLayoutCode>
            </Flex>
          </Grid>
        </DevComponentCard>

        <DevComponentCard title="Grid">
          <Grid columns={{ desktop: 2, phone: 1 }} gap={4}>
            <Flex direction="column" gap={3}>
              <Grid columns={2} gap={2}>
                <NumberInput
                  label={gridResponsive ? "desktop columns" : "columns"}
                  value={gridColumns}
                  min={1}
                  max={12}
                  disabled={!!gridTemplate}
                  onChange={handleGridColumnsChange}
                />
                <NumberInput
                  label="gap"
                  value={gridGap}
                  min={0}
                  max={10}
                  onChange={handleGridGapChange}
                />
              </Grid>
              {gridResponsive && (
                <Grid columns={2} gap={2}>
                  <NumberInput
                    label="tablet columns"
                    value={gridTabletColumns}
                    min={1}
                    max={12}
                    disabled={!!gridTemplate}
                    onChange={handleGridTabletColumnsChange}
                  />
                  <NumberInput
                    label="phone columns"
                    value={gridPhoneColumns}
                    min={1}
                    max={12}
                    disabled={!!gridTemplate}
                    onChange={handleGridPhoneColumnsChange}
                  />
                </Grid>
              )}
              <Switch
                label="responsive"
                checked={gridResponsive}
                onChange={handleGridResponsiveChange}
              />
              <TextInput
                label="template"
                placeholder="1fr 2fr 1fr"
                value={gridTemplate}
                onChange={handleGridTemplateChange}
              />
              <NumberInput
                label="items"
                value={gridItemCount}
                min={0}
                max={30}
                onChange={handleGridItemCountChange}
              />
            </Flex>
            <Flex direction="column" gap={2}>
              <StyledLayoutPreview>
                <Grid
                  columns={gridColumnsValue}
                  template={gridTemplate || undefined}
                  gap={toNumber(gridGap)}
                >
                  {gridItems.map((item) => (
                    <StyledLayoutSample
                      align="center"
                      justify="center"
                      key={item}
                      sampleHeight={SAMPLE_HEIGHTS[0]}
                    >
                      {item}
                    </StyledLayoutSample>
                  ))}
                </Grid>
              </StyledLayoutPreview>
              <StyledLayoutCode>
                <Text size="sm" color="inherit">
                  {gridCode}
                </Text>
              </StyledLayoutCode>
            </Flex>
          </Grid>
        </DevComponentCard>
      </Flex>
    </PageLayout>
  );
}

const StyledLayoutPreview = styled(Flex)(({ theme }) => ({
  minHeight: 240,

  padding: theme.spacing(3),

  overflow: "auto",

  border: `1px dashed ${theme.palette.scale[300]}`,
  borderRadius: theme.shape.borderRadiusScale.md,

  backgroundColor: theme.palette.scale[50],

  "& > *": {
    flex: 1,
    minWidth: 0,
  },
}));

const StyledLayoutSample = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "sampleHeight",
})<{ sampleHeight: number }>(({ theme, sampleHeight }) => ({
  minWidth: 48,
  height: sampleHeight,

  padding: theme.spacing(0, 3),

  border: `1px solid ${theme.palette.scale[300]}`,
  borderRadius: theme.shape.borderRadiusScale.sm,

  backgroundColor: theme.palette.scale[100],
  color: theme.palette.scale[700],
}));

const StyledLayoutCode = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(2, 3),

  overflowX: "auto",

  borderRadius: theme.shape.borderRadiusScale.md,

  backgroundColor: theme.palette.scale[900],
  color: theme.palette.scale[0],
}));
