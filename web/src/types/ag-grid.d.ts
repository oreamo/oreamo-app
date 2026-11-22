import "ag-grid-community";

import type { SelectInputOption } from "@/components/common/input/SelectInput";

declare module "ag-grid-community" {
  interface ColDef {
    context?: GridColDefContext;
  }
}

export interface GridColDefContext {
  align?: "left" | "center" | "right";
  required?: boolean;
  visible?: (gridContext: GridContext) => boolean;
  cell?: GridCell;
}

export type GridCell = GridInputCell | GridSelectCell | GridButtonCell;

export interface GridInputCell extends GridCellBase {
  type: "text" | "number" | "checkbox" | "date";
  addable?: boolean;
}

export interface GridSelectCell extends GridCellBase {
  type: "select" | "multi-select";
  options: SelectInputOption[];
  addable?: boolean;
}

export interface GridButtonCell extends GridCellBase {
  type: "button";
  label: string;
  onClick(data: unknown): void;
}

interface GridCellBase {
  visible?: (cellContext: GridCellContext) => boolean;
}

export interface GridCellContext extends GridContext {
  rowState?: RowEditState;
  data?: unknown;
}

export interface GridContext {
  gridMode: GridMode;
}

export type GridMode = "read" | "edit";

export type RowEditState = "exist" | "new" | "edited" | "deleted";
