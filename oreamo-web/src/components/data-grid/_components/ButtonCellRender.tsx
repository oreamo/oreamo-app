import { CustomCellRendererProps } from "ag-grid-react";

import { Button } from "@/components/common/button/Button";

export interface ButtonCellRenderParams<TData = unknown> {
  label: string;
  onClick: (data: TData) => void;
}

type ButtonCellRenderProps = CustomCellRendererProps & ButtonCellRenderParams;

export function ButtonCellRender({
  data,
  label,
  onClick,
}: ButtonCellRenderProps) {
  const handleClick = () => {
    onClick(data);
  };

  return (
    <Button variant="outlined" size="small" fullWidth onClick={handleClick}>
      {label}
    </Button>
  );
}
