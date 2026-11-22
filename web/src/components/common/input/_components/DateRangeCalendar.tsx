import { MouseEvent, useState } from "react";

import { styled } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickerDayOwnerStateBase } from "@mui/x-date-pickers/PickerDay";
import dayjs, { Dayjs } from "dayjs";

import { IconButton } from "@/components/common/button/IconButton";
import { Text } from "@/components/common/display/Text";
import { DateRangeValue } from "@/components/common/input/DateRangeInput";
import { DATE_FORMAT } from "@/constants/date-time-constant";

export type DateRangePosition = "start" | "end";

const DAY_CLASS_NAME = {
  selectionStart: "date-range-day-selection-start",
  selectionEnd: "date-range-day-selection-end",
  insideSelection: "date-range-day-inside-selection",
  previewStart: "date-range-day-preview-start",
  previewEnd: "date-range-day-preview-end",
  insidePreview: "date-range-day-inside-preview",
  edgeStart: "date-range-day-edge-start",
  edgeEnd: "date-range-day-edge-end",
};

interface DateRangeSelection {
  value: DateRangeValue;
  nextRangePosition: DateRangePosition;
}

interface DateRangeCalendarProps {
  calendars?: number;
  value: DateRangeValue;
  rangePosition: DateRangePosition;
  onChange: (
    value: DateRangeValue,
    nextRangePosition: DateRangePosition,
  ) => void;
}

export function DateRangeCalendar({
  calendars = 2,
  value,
  rangePosition,
  onChange,
}: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return dayjs(value[0] ?? value[1]).startOf("month");
  });
  const [previewDay, setPreviewDay] = useState<string>();

  const [startValue, endValue] = value;

  const isCompleteRange = (
    range: DateRangeValue,
  ): range is [string, string] => {
    return !!range[0] && !!range[1];
  };

  const isWithinRange = (day: string, range: DateRangeValue) => {
    if (!isCompleteRange(range)) {
      return false;
    }

    return day >= range[0] && day <= range[1];
  };

  const calculateSelection = (day: string): DateRangeSelection => {
    if (rangePosition === "start") {
      if (endValue && day > endValue) {
        return { value: [day, undefined], nextRangePosition: "end" };
      }

      return { value: [day, endValue], nextRangePosition: "end" };
    }

    if (startValue && day < startValue) {
      return { value: [day, undefined], nextRangePosition: "end" };
    }

    return { value: [startValue, day], nextRangePosition: "start" };
  };

  const calculatePreviewRange = (): DateRangeValue => {
    if (!previewDay || isWithinRange(previewDay, value)) {
      return [undefined, undefined];
    }

    const { value: nextValue } = calculateSelection(previewDay);

    if (!isCompleteRange(value) || !isCompleteRange(nextValue)) {
      return nextValue;
    }

    return rangePosition === "start"
      ? [nextValue[0], value[0]]
      : [value[1], nextValue[1]];
  };

  const previewRange = calculatePreviewRange();

  const getDayClassName = (day: Dayjs, ownerState: PickerDayOwnerStateBase) => {
    const formattedDay = day.format(DATE_FORMAT);
    const hasSelection = isCompleteRange(value);
    const hasPreview = isCompleteRange(previewRange);

    return [
      hasSelection &&
        formattedDay === startValue &&
        DAY_CLASS_NAME.selectionStart,
      hasSelection && formattedDay === endValue && DAY_CLASS_NAME.selectionEnd,
      isWithinRange(formattedDay, value) && DAY_CLASS_NAME.insideSelection,
      hasPreview &&
        formattedDay === previewRange[0] &&
        DAY_CLASS_NAME.previewStart,
      hasPreview &&
        formattedDay === previewRange[1] &&
        DAY_CLASS_NAME.previewEnd,
      isWithinRange(formattedDay, previewRange) && DAY_CLASS_NAME.insidePreview,
      (ownerState.isDayStartOfWeek || day.date() === 1) &&
        DAY_CLASS_NAME.edgeStart,
      (ownerState.isDayEndOfWeek || day.date() === day.daysInMonth()) &&
        DAY_CLASS_NAME.edgeEnd,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const handleChange = (newValue: Dayjs | null) => {
    if (!newValue) return;

    const selection = calculateSelection(newValue.format(DATE_FORMAT));
    setPreviewDay(undefined);
    onChange(selection.value, selection.nextRangePosition);
  };

  const handlePreviousMonthClick = () => {
    setCurrentMonth((month) => month.subtract(1, "month"));
  };

  const handleNextMonthClick = () => {
    setCurrentMonth((month) => month.add(1, "month"));
  };

  const handleDayMouseEnter = (
    _: MouseEvent<HTMLButtonElement>,
    day: Dayjs,
  ) => {
    setPreviewDay(day.format(DATE_FORMAT));
  };

  const handleMouseLeave = () => {
    setPreviewDay(undefined);
  };

  const getDayProps = (ownerState: PickerDayOwnerStateBase) => {
    const day = ownerState.day.format(DATE_FORMAT);

    return {
      selected: day === startValue || day === endValue,
      className: getDayClassName(ownerState.day, ownerState),
      onMouseEnter: handleDayMouseEnter,
    };
  };

  const months = Array.from({ length: calendars }, (_, index) => {
    return currentMonth.add(index, "month");
  });

  return (
    <StyledDateRangeCalendarContainer onMouseLeave={handleMouseLeave}>
      {months.map((month, index) => (
        <StyledDateRangeCalendarWrapper key={index}>
          <StyledDateRangeCalendarGroup>
            {index === 0 ? (
              <IconButton
                iconName="ChevronLeft"
                size="small"
                onClick={handlePreviousMonthClick}
              />
            ) : (
              <span />
            )}
            <Text size="sm" weight="medium">
              {month.format("YYYY.MM.DD")}
            </Text>
            {index === calendars - 1 ? (
              <IconButton
                iconName="ChevronRight"
                size="small"
                onClick={handleNextMonthClick}
              />
            ) : (
              <span />
            )}
          </StyledDateRangeCalendarGroup>
          <StyledDateRangeCalendarMonth
            key={month.format("YYYY-MM")}
            value={null}
            referenceDate={month}
            views={["day"]}
            slotProps={{ day: getDayProps }}
            onChange={handleChange}
          />
        </StyledDateRangeCalendarWrapper>
      ))}
    </StyledDateRangeCalendarContainer>
  );
}

const StyledDateRangeCalendarContainer = styled("div")({
  display: "flex",
});

const StyledDateRangeCalendarWrapper = styled("div")(({ theme }) => ({
  "&:not(:last-of-type)": {
    borderRight: `1px solid ${theme.palette.scale[200]}`,
  },
}));

const StyledDateRangeCalendarGroup = styled("div")(({ theme }) => ({
  padding: theme.spacing(3, 4, 1),

  display: "grid",
  gridTemplateColumns: "32px 1fr 32px",
  alignItems: "center",
  justifyItems: "center",
}));

const StyledDateRangeCalendarMonth = styled(DateCalendar)(({ theme }) => ({
  height: "auto",

  "& .MuiPickersCalendarHeader-root": {
    display: "none",
  },

  "& .MuiPickerDay-root": {
    position: "relative",
    isolation: "isolate",
  },

  "& .MuiPickerDay-root::before, & .MuiPickerDay-root::after": {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: -2,
    right: -2,
    zIndex: -1,
    pointerEvents: "none",
    mixBlendMode: "multiply",
  },

  [[
    `& .${DAY_CLASS_NAME.selectionStart}::before`,
    `& .${DAY_CLASS_NAME.selectionEnd}::before`,
    `& .${DAY_CLASS_NAME.insideSelection}::before`,
  ].join(", ")]: {
    content: '""',
    backgroundColor: theme.palette.scale[100],
  },

  [[
    `& .${DAY_CLASS_NAME.previewStart}::after`,
    `& .${DAY_CLASS_NAME.previewEnd}::after`,
    `& .${DAY_CLASS_NAME.insidePreview}::after`,
  ].join(", ")]: {
    content: '""',
    border: `1px dashed ${theme.palette.scale[300]}`,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },

  [[
    `& .${DAY_CLASS_NAME.selectionStart}::before`,
    `& .${DAY_CLASS_NAME.edgeStart}::before`,
    `& .${DAY_CLASS_NAME.previewStart}::after`,
    `& .${DAY_CLASS_NAME.edgeStart}::after`,
  ].join(", ")]: {
    left: 0,
    borderTopLeftRadius: "inherit",
    borderBottomLeftRadius: "inherit",
    borderLeftColor: theme.palette.scale[300],
  },

  [[
    `& .${DAY_CLASS_NAME.selectionEnd}::before`,
    `& .${DAY_CLASS_NAME.edgeEnd}::before`,
    `& .${DAY_CLASS_NAME.previewEnd}::after`,
    `& .${DAY_CLASS_NAME.edgeEnd}::after`,
  ].join(", ")]: {
    right: 0,
    borderTopRightRadius: "inherit",
    borderBottomRightRadius: "inherit",
    borderRightColor: theme.palette.scale[300],
  },
}));
