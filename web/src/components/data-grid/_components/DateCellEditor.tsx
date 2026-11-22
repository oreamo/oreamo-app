import { CustomCellEditorProps, useGridCellEditor } from "ag-grid-react";

import { DateInput } from "@/components/common/input/DateInput";

export function DateCellEditor({
  value,
  onValueChange,
}: CustomCellEditorProps<unknown, string>) {
  useGridCellEditor({});

  const handleFocusRef = (element: HTMLInputElement | null) => {
    element?.focus();
  };

  const handleChange = (nextValue?: string) => {
    onValueChange(nextValue ?? null);
  };

  return (
    <DateInput
      ref={handleFocusRef}
      value={value ?? undefined}
      onChange={handleChange}
    />
  );
}
