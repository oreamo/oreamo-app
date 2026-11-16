import { FocusEvent, useState } from "react";

import { InputAdornment, styled } from "@mui/material";
import { MultiSectionDigitalClock } from "@mui/x-date-pickers/MultiSectionDigitalClock";
import dayjs, { Dayjs } from "dayjs";

import { IconButton } from "@/components/common/button/IconButton";
import { Text } from "@/components/common/display/Text";
import {
  DateRangeCalendar,
  DateRangePosition,
} from "@/components/common/input/_components/DateRangeCalendar";
import { DateInputType } from "@/components/common/input/DateInput";
import { TextInput } from "@/components/common/input/TextInput";
import { Dropdown } from "@/components/common/overlay/Dropdown";
import {
  DATE_FORMAT,
  DATE_INPUT_TYPE_FORMAT,
  TIME_FORMAT,
} from "@/constants/date-time-constant";
import { useMedia } from "@/hooks/useMedia";

const DEFAULT_TIME = "00:00:00";

export type DateRangeValue = [string | undefined, string | undefined];

export interface DateRangeInputProps {
  type?: DateInputType;
  value?: DateRangeValue;
  label?: string;
  helperText?: string;
  readonly?: boolean;
  disabled?: boolean;
  error?: boolean;
  onChange?: (value: DateRangeValue) => void;
  onBlur?: () => void;
}

export function DateRangeInput({
  type = "date",
  value,
  label,
  helperText,
  readonly,
  disabled,
  error,
  onChange,
  onBlur,
}: DateRangeInputProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [internalValue, setInternalValue] = useState<DateRangeValue>(
    value ?? [undefined, undefined],
  );
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [rangePosition, setRangePosition] =
    useState<DateRangePosition>("start");

  const { isDesktop } = useMedia();

  if (value !== prevValue) {
    setPrevValue(value);
    setInternalValue(value ?? [undefined, undefined]);
  }

  const [startValue, endValue] = internalValue;

  const format = DATE_INPUT_TYPE_FORMAT[type];

  const parseValue = (target?: string) => {
    return target ? dayjs(target, format) : null;
  };

  const getDatePart = (target?: string) => {
    return parseValue(target)?.format(DATE_FORMAT);
  };

  const getTimePart = (target?: string) => {
    return parseValue(target)?.format(TIME_FORMAT) ?? DEFAULT_TIME;
  };

  const combineDateTime = (date: string, time: string) => {
    return dayjs(`${date} ${time}`, `${DATE_FORMAT} ${TIME_FORMAT}`).format(
      format,
    );
  };

  const isCompleteRange = (
    value: DateRangeValue,
  ): value is [string, string] => {
    return !!value[0] && !!value[1];
  };

  const formatRange = () => {
    if (!startValue && !endValue) {
      return "";
    }

    return `${startValue ?? ""} – ${endValue ?? ""}`;
  };

  const normalizeRange = (value: [string, string]): [string, string] => {
    return value[0] > value[1] ? [value[1], value[0]] : value;
  };

  const resetIfIncomplete = () => {
    if (!isCompleteRange(internalValue)) {
      setInternalValue(value ?? [undefined, undefined]);
    }
  };

  const commitIfChanged = (nextValue: [string, string]) => {
    if (nextValue[0] === value?.[0] && nextValue[1] === value?.[1]) return;

    onChange?.(nextValue);
  };

  const handleCalendarOpen = () => {
    if (disabled || readonly) return;

    setRangePosition("start");
    setCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    if (isCompleteRange(internalValue)) {
      const normalized = normalizeRange(internalValue);
      setInternalValue(normalized);
      commitIfChanged(normalized);
    }

    resetIfIncomplete();
    setCalendarOpen(false);
  };

  const handleCalendarChange = (
    nextDates: DateRangeValue,
    nextRangePosition: DateRangePosition,
  ) => {
    const nextValue = nextDates.map((date, index) => {
      if (!date || type === "date") {
        return date;
      }

      return combineDateTime(date, getTimePart(internalValue[index]));
    }) as DateRangeValue;

    setInternalValue(nextValue);

    if (
      type === "date" &&
      rangePosition === "end" &&
      isCompleteRange(nextValue)
    ) {
      setRangePosition("start");
      setCalendarOpen(false);
      commitIfChanged(nextValue);
      return;
    }

    setRangePosition(nextRangePosition);
  };

  const changeTime = (index: number, newTime: Dayjs | null) => {
    if (!newTime) return;

    const time = newTime.format(TIME_FORMAT);
    const date = getDatePart(internalValue[index]);
    const nextItem =
      type === "time" ? time : date && combineDateTime(date, time);

    if (!nextItem) return;

    const nextValue = [...internalValue] as DateRangeValue;
    nextValue[index] = nextItem;
    setInternalValue(nextValue);
  };

  const handleStartTimeChange = (newTime: Dayjs | null) => {
    changeTime(0, newTime);
  };

  const handleEndTimeChange = (newTime: Dayjs | null) => {
    changeTime(1, newTime);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as Node | null;

    if (event.currentTarget.contains(relatedTarget)) {
      return;
    }

    if (
      relatedTarget instanceof Element &&
      relatedTarget.closest(".MuiModal-root")
    ) {
      return;
    }

    resetIfIncomplete();
    onBlur?.();
  };

  const showCalendar = type !== "time";
  const showTime = type !== "date";
  const calendarValue: DateRangeValue = [
    getDatePart(startValue),
    getDatePart(endValue),
  ];

  return (
    <StyledDateRangeInputContainer ref={setContainerEl} onBlur={handleBlur}>
      <TextInput
        value={formatRange()}
        label={label}
        placeholder={`${format} – ${format}`}
        helperText={helperText}
        readonly={readonly}
        disableEditing
        disabled={disabled}
        error={error}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              iconName={type === "time" ? "AccessTime" : "Event"}
              edge="end"
              disabled={disabled || readonly}
              onClick={handleCalendarOpen}
            />
          </InputAdornment>
        }
        onClick={handleCalendarOpen}
      />
      <Dropdown
        open={calendarOpen}
        anchorEl={containerEl}
        title={label}
        onClose={handleCalendarClose}
      >
        <StyledDateRangeInputWrapper vertical={!isDesktop}>
          {showCalendar && (
            <DateRangeCalendar
              calendars={showTime || !isDesktop ? 1 : 2}
              value={calendarValue}
              rangePosition={rangePosition}
              onChange={handleCalendarChange}
            />
          )}
          {showTime && (
            <StyledDateRangeInputGroup
              showCalendar={showCalendar}
              vertical={!isDesktop}
            >
              <MultiSectionDigitalClock
                value={parseValue(startValue)}
                views={["hours", "minutes", "seconds"]}
                ampm={false}
                disabled={type === "date-time" && !startValue}
                onChange={handleStartTimeChange}
              />
              <Text color="disabled">~</Text>
              <MultiSectionDigitalClock
                value={parseValue(endValue)}
                views={["hours", "minutes", "seconds"]}
                ampm={false}
                disabled={type === "date-time" && !endValue}
                onChange={handleEndTimeChange}
              />
            </StyledDateRangeInputGroup>
          )}
        </StyledDateRangeInputWrapper>
      </Dropdown>
    </StyledDateRangeInputContainer>
  );
}

const StyledDateRangeInputContainer = styled("div")({
  width: "100%",
  minWidth: 0,
});

const StyledDateRangeInputWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "vertical",
})<{ vertical: boolean }>(({ vertical }) => ({
  display: "flex",
  flexDirection: vertical ? "column" : "row",
  alignItems: vertical ? "center" : "stretch",
}));

const StyledDateRangeInputGroup = styled("div", {
  shouldForwardProp: (prop) => prop !== "showCalendar" && prop !== "vertical",
})<{ showCalendar: boolean; vertical: boolean }>(
  ({ theme, showCalendar, vertical }) => ({
    padding: theme.spacing(0, 2),

    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),

    ...(showCalendar &&
      (vertical
        ? { borderTop: `1px solid ${theme.palette.scale[200]}` }
        : { borderLeft: `1px solid ${theme.palette.scale[200]}` })),
  }),
);
