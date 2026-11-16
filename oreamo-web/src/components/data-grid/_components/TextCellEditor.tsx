import { ChangeEvent } from "react";

import { CustomCellEditorProps, useGridCellEditor } from "ag-grid-react";

import { TextInput } from "@/components/common/input/TextInput";

export function TextCellEditor({
  value,
  onValueChange,
}: CustomCellEditorProps<unknown, string>) {
  useGridCellEditor({});

  const handleFocusRef = (element: HTMLInputElement | null) => {
    element?.focus();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  return (
    <TextInput
      ref={handleFocusRef}
      value={value ?? ""}
      onChange={handleChange}
    />
  );
}
