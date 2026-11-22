import { CustomCellEditorProps, useGridCellEditor } from "ag-grid-react";

import {
  SelectInput,
  SelectInputOption,
} from "@/components/common/input/SelectInput";

export interface SelectCellEditorParams {
  options: SelectInputOption[];
}

type SelectCellEditorProps = CustomCellEditorProps<unknown, string | number> &
  SelectCellEditorParams;

export function SelectCellEditor({
  value,
  options,
  onValueChange,
}: SelectCellEditorProps) {
  useGridCellEditor({});

  const handleFocusRef = (element: HTMLInputElement | null) => {
    element?.focus();
  };

  const handleChange = (nextValue: string | number | null) => {
    onValueChange(nextValue);
  };

  return (
    <SelectInput
      ref={handleFocusRef}
      value={value}
      options={options}
      onChange={handleChange}
    />
  );
}
