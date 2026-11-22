import { CustomCellEditorProps, useGridCellEditor } from "ag-grid-react";

import { MultiSelectInput } from "@/components/common/input/MultiSelectInput";
import { SelectInputOption } from "@/components/common/input/SelectInput";

export interface MultiSelectCellEditorParams {
  options: SelectInputOption[];
}

type MultiSelectCellEditorProps = CustomCellEditorProps<
  unknown,
  (string | number)[]
> &
  MultiSelectCellEditorParams;

export function MultiSelectCellEditor({
  value,
  options,
  onValueChange,
}: MultiSelectCellEditorProps) {
  useGridCellEditor({});

  const handleFocusRef = (element: HTMLInputElement | null) => {
    element?.focus();
  };

  const handleChange = (nextValue: (string | number)[]) => {
    onValueChange(nextValue);
  };

  return (
    <MultiSelectInput
      ref={handleFocusRef}
      openOnFocus
      value={value ?? []}
      options={options}
      onChange={handleChange}
    />
  );
}
