import { CustomCellEditorProps, useGridCellEditor } from "ag-grid-react";

import { Switch } from "@/components/common/button/Switch";

export function CheckboxCellEditor({
  value,
  onValueChange,
}: CustomCellEditorProps<unknown, boolean>) {
  useGridCellEditor({});

  const handleChange = (checked: boolean) => {
    onValueChange(checked);
  };

  return <Switch checked={value ?? false} onChange={handleChange} />;
}
