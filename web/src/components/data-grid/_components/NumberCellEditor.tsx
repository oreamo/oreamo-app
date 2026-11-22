import { CustomCellEditorProps, useGridCellEditor } from "ag-grid-react";

import { NumberInput } from "@/components/common/input/NumberInput";

export function NumberCellEditor({
  value,
  onValueChange,
}: CustomCellEditorProps<unknown, number>) {
  useGridCellEditor({});

  const handleFocusRef = (element: HTMLInputElement | null) => {
    element?.focus();
  };

  const handleChange = (nextValue: number | "") => {
    onValueChange(nextValue === "" ? null : nextValue);
  };

  return (
    <NumberInput
      ref={handleFocusRef}
      value={value ?? ""}
      onChange={handleChange}
    />
  );
}
