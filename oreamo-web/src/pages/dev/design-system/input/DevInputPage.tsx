import { useState } from "react";

import { styled } from "@mui/material";

import { Button } from "@/components/common/button/Button";
import { Text } from "@/components/common/display/Text";
import { DateInput } from "@/components/common/input/DateInput";
import {
  DateRangeInput,
  DateRangeValue,
} from "@/components/common/input/DateRangeInput";
import { FileInput } from "@/components/common/input/FileInput";
import { MultiSearchInput } from "@/components/common/input/MultiSearchInput";
import { MultiSelectInput } from "@/components/common/input/MultiSelectInput";
import { NumberInput } from "@/components/common/input/NumberInput";
import {
  SearchInput,
  SearchInputValue,
} from "@/components/common/input/SearchInput";
import {
  SelectInput,
  SelectInputOption,
} from "@/components/common/input/SelectInput";
import { Textarea } from "@/components/common/input/Textarea";
import { TextInput } from "@/components/common/input/TextInput";
import { Flex } from "@/components/common/layout/Flex";
import { DateInputField } from "@/components/data-form/components/DateInputField";
import { DateRangeInputField } from "@/components/data-form/components/DateRangeInputField";
import { FileInputField } from "@/components/data-form/components/FileInputField";
import { MultiSearchInputField } from "@/components/data-form/components/MultiSearchInputField";
import { MultiSelectInputField } from "@/components/data-form/components/MultiSelectInputField";
import { NumberInputField } from "@/components/data-form/components/NumberInputField";
import { SearchInputField } from "@/components/data-form/components/SearchInputField";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextareaField } from "@/components/data-form/components/TextareaField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { DataForm } from "@/components/data-form/DataForm";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { PageLayout } from "@/pages/_components/PageLayout";
import { DevCardGrid } from "@/pages/dev/_components/DevCardGrid";
import { DevComponentCard } from "@/pages/dev/_components/DevComponentCard";
import { DevMultiSearchSelectDialog } from "@/pages/dev/_components/DevMultiSearchSelectDialog";
import { DevSearchSelectDialog } from "@/pages/dev/_components/DevSearchSelectDialog";

const SELECT_OPTIONS: SelectInputOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

const MULTI_SELECT_OPTIONS: SelectInputOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
];

interface DevFieldFormValues {
  text: string;
  bio: string;
  age: number | "";
  fruit: string | number | null;
  multiFruit: (string | number)[];
  singleSearch?: SearchInputValue;
  search: SearchInputValue[];
  date?: string;
  time?: string;
  dateTime?: string;
  range: DateRangeValue;
  timeRange: DateRangeValue;
  dateTimeRange: DateRangeValue;
  fileGroupId?: string;
}

export function DevInputPage() {
  const [submittedValue, setSubmittedValue] = useState<DevFieldFormValues>();

  const { form, handleSubmit, handleEnter } = useDataForm<DevFieldFormValues>({
    defaultValues: {
      text: "",
      bio: "",
      age: "",
      fruit: null,
      multiFruit: [],
      singleSearch: undefined,
      search: [],
      date: undefined,
      time: undefined,
      dateTime: undefined,
      range: [undefined, undefined],
      timeRange: [undefined, undefined],
      dateTimeRange: [undefined, undefined],
      fileGroupId: "",
    },
    onValid: (data) => {
      setSubmittedValue(data);
    },
  });

  return (
    <PageLayout>
      <DataForm form={form} onEnter={handleEnter}>
        <DevCardGrid>
          <DevComponentCard title="Text Input">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <TextInputField<DevFieldFormValues, "text">
                  name="text"
                  required
                  label="Text"
                  placeholder="Enter text..."
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <TextInput label="Text" value="Readonly value" readonly />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <TextInput label="Text" value="Disabled value" disabled />
              </Flex>
            </Flex>
          </DevComponentCard>

          <DevComponentCard title="Textarea">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <TextareaField<DevFieldFormValues, "bio">
                  name="bio"
                  required
                  label="Textarea"
                  renderProps={{ rows: 3 }}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <Textarea
                  label="Textarea"
                  rows={3}
                  value="Readonly value"
                  readonly
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <Textarea
                  label="Textarea"
                  rows={3}
                  value="Disabled value"
                  disabled
                />
              </Flex>
            </Flex>
          </DevComponentCard>

          <DevComponentCard title="Number Input">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <NumberInputField<DevFieldFormValues, "age">
                  name="age"
                  required
                  label="Number"
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <NumberInput label="Number" value={42} readonly />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <NumberInput label="Number" value={42} disabled />
              </Flex>
            </Flex>
          </DevComponentCard>

          <DevComponentCard title="Select">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <SelectInputField<DevFieldFormValues, "fruit">
                  name="fruit"
                  required
                  label="Select"
                  options={SELECT_OPTIONS}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <SelectInput
                  label="Select"
                  options={SELECT_OPTIONS}
                  value="apple"
                  readonly
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <SelectInput
                  label="Select"
                  options={SELECT_OPTIONS}
                  value="apple"
                  disabled
                />
              </Flex>
            </Flex>
          </DevComponentCard>

          <DevComponentCard title="Multi Select">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <MultiSelectInputField<DevFieldFormValues, "multiFruit">
                  name="multiFruit"
                  required
                  label="Multi Select"
                  options={MULTI_SELECT_OPTIONS}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <MultiSelectInput
                  label="Multi Select"
                  options={MULTI_SELECT_OPTIONS}
                  value={["apple"]}
                  readonly
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <MultiSelectInput
                  label="Multi Select"
                  options={MULTI_SELECT_OPTIONS}
                  value={["apple"]}
                  disabled
                />
              </Flex>
            </Flex>
          </DevComponentCard>

          <DevComponentCard title="Search">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <SearchInputField<DevFieldFormValues, "singleSearch">
                  name="singleSearch"
                  required
                  placeholder="Search"
                  dialog={<DevSearchSelectDialog />}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <SearchInput
                  value={{ value: "readonly", label: "Readonly value" }}
                  readonly
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <SearchInput
                  value={{ value: "disabled", label: "Disabled value" }}
                  disabled
                />
              </Flex>
            </Flex>
          </DevComponentCard>

          <DevComponentCard title="Multi Search">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <MultiSearchInputField<DevFieldFormValues, "search">
                  name="search"
                  required
                  label="Multi Search"
                  placeholder="Search"
                  dialog={<DevMultiSearchSelectDialog />}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <MultiSearchInput
                  value={[{ value: "readonly", label: "Readonly value" }]}
                  label="Multi Search"
                  readonly
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <MultiSearchInput
                  value={[{ value: "disabled", label: "Disabled value" }]}
                  label="Multi Search"
                  disabled
                />
              </Flex>
            </Flex>
          </DevComponentCard>

          <DevComponentCard title="Date">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <DateInputField<DevFieldFormValues, "date">
                  name="date"
                  required
                  label="Date"
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Time
                </Text>
                <DateInputField<DevFieldFormValues, "time">
                  name="time"
                  required
                  label="Time"
                  renderProps={{ type: "time" }}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Date Time
                </Text>
                <DateInputField<DevFieldFormValues, "dateTime">
                  name="dateTime"
                  required
                  label="Date Time"
                  renderProps={{ type: "date-time" }}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <DateInput label="Date" value="2026-08-15" readonly />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <DateInput label="Date" value="2026-08-15" disabled />
              </Flex>
            </Flex>
          </DevComponentCard>

          <DevComponentCard title="Date Range">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <DateRangeInputField<DevFieldFormValues, "range">
                  name="range"
                  required
                  label="Date Range"
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Time
                </Text>
                <DateRangeInputField<DevFieldFormValues, "timeRange">
                  name="timeRange"
                  required
                  label="Time Range"
                  renderProps={{ type: "time" }}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Date Time
                </Text>
                <DateRangeInputField<DevFieldFormValues, "dateTimeRange">
                  name="dateTimeRange"
                  required
                  label="Date Time Range"
                  renderProps={{ type: "date-time" }}
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <DateRangeInput
                  label="Date Range"
                  value={["2026-08-01", "2026-08-15"]}
                  readonly
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <DateRangeInput
                  label="Date Range"
                  value={["2026-08-01", "2026-08-15"]}
                  disabled
                />
              </Flex>
            </Flex>
          </DevComponentCard>

          <DevComponentCard title="File">
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Normal
                </Text>
                <FileInputField<DevFieldFormValues, "fileGroupId">
                  name="fileGroupId"
                  required
                  label="File"
                  placeholder="Attach files"
                />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Readonly
                </Text>
                <FileInput label="File" readonly />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text size="xs" color="secondary">
                  Disabled
                </Text>
                <FileInput label="File" disabled />
              </Flex>
            </Flex>
          </DevComponentCard>
        </DevCardGrid>

        <Flex gap={1} justify="end">
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Flex>
        {submittedValue && (
          <StyledResultContainer direction="column">
            <Text size="sm">{JSON.stringify(submittedValue, null, 2)}</Text>
          </StyledResultContainer>
        )}
      </DataForm>
    </PageLayout>
  );
}

const StyledResultContainer = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(2),

  borderRadius: theme.shape.borderRadiusScale.md,
  border: `1px solid ${theme.palette.scale[200]}`,

  backgroundColor: theme.palette.scale[50],
  whiteSpace: "pre-wrap",
}));
