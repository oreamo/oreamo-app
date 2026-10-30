import { RefObject, createElement } from "react";

import type {
  CellClassParams,
  ColDef,
  ColGroupDef,
  EditableCallbackParams,
  ICellRendererParams,
  IRowNode,
  ValueFormatterParams,
} from "ag-grid-community";

import { IconButton } from "@/components/common/button/IconButton";
import { Icon, IconName } from "@/components/common/display/Icon";
import { SelectInputOption } from "@/components/common/input/SelectInput";
import { ButtonCellRender } from "@/components/data-grid/_components/ButtonCellRender";
import { CheckboxCellEditor } from "@/components/data-grid/_components/CheckboxCellEditor";
import { DateCellEditor } from "@/components/data-grid/_components/DateCellEditor";
import { MultiSelectCellEditor } from "@/components/data-grid/_components/MultiSelectCellEditor";
import { NumberCellEditor } from "@/components/data-grid/_components/NumberCellEditor";
import { SelectCellEditor } from "@/components/data-grid/_components/SelectCellEditor";
import { TextCellEditor } from "@/components/data-grid/_components/TextCellEditor";
import { GRID_WIDTH } from "@/constants/foundation-constant";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { GridCell, GridMode, RowEditState } from "@/types/ag-grid";

export const DETAIL_COL_ID = "rowDetail";

interface UseDataGridColumnsOptions<R extends object> {
  rowStatesRef: RefObject<Map<string, { state: RowEditState; original?: R }>>;
  columnDefs?: (ColDef<R> | ColGroupDef<R>)[] | null;
  gridMode: GridMode;
  onDetail?: (data: R) => void;
}

export function useDataGridColumns<R extends object>({
  columnDefs,
  gridMode,
  rowStatesRef,
  onDetail,
}: UseDataGridColumnsOptions<R>) {
  const { translate } = useTranslate();

  const createOptionLabelFormatter = (options: SelectInputOption[]) => {
    const toLabel = (value: unknown) => {
      const option = options.find((option) => option.value === value);
      return String(option?.label ?? value ?? "");
    };

    return (params: ValueFormatterParams<R>) => {
      if (Array.isArray(params.value)) {
        return params.value.map(toLabel).join(", ");
      }

      return toLabel(params.value);
    };
  };

  const getRowState = (node: IRowNode<R>) => {
    return node.id ? rowStatesRef.current.get(node.id)?.state : undefined;
  };

  const isCellVisible = (cell: GridCell | undefined, node: IRowNode<R>) => {
    if (!cell?.visible) return true;

    return cell.visible({
      gridMode,
      rowState: getRowState(node),
      data: node.data,
    });
  };

  const isSameValue = (a: unknown, b: unknown) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return (
        a.length === b.length &&
        a.every((value, index) => {
          return value === b[index];
        })
      );
    }

    return a === b;
  };

  const isCellEdited = (params: CellClassParams<R>) => {
    const field = params.colDef.field;

    if (!field || !params.node.id || !params.data) return false;

    const rowState = rowStatesRef.current.get(params.node.id);

    if (rowState?.state !== "edited" || !rowState.original) return false;

    const originalValue = (rowState.original as Record<string, unknown>)[field];
    const currentValue = (params.data as Record<string, unknown>)[field];

    return !isSameValue(originalValue, currentValue);
  };

  const resolvedColumnDefs = (() => {
    const normalizedColumnDefs = columnDefs?.map((columnDef) => {
      if ("children" in columnDef) {
        return columnDef;
      }

      const {
        align = "left",
        required,
        visible,
        cell,
      } = columnDef.context ?? {};
      const type =
        cell?.type ?? (columnDef.editable === true ? "text" : undefined);
      const addable = cell && "addable" in cell ? cell.addable : undefined;
      const selectOptions =
        cell?.type === "select" || cell?.type === "multi-select"
          ? cell.options
          : undefined;

      const baseCellRenderer =
        columnDef.cellRenderer ??
        (type === "button" ? ButtonCellRender : undefined);

      return {
        ...columnDef,
        hide: visible ? !visible({ gridMode }) : columnDef.hide,
        cellEditorParams: selectOptions
          ? { ...columnDef.cellEditorParams, options: selectOptions }
          : columnDef.cellEditorParams,
        cellRendererParams:
          cell?.type === "button"
            ? {
                ...columnDef.cellRendererParams,
                label: cell.label,
                onClick: cell.onClick,
              }
            : columnDef.cellRendererParams,
        valueFormatter:
          columnDef.valueFormatter ??
          (selectOptions
            ? createOptionLabelFormatter(selectOptions)
            : undefined),
        editable: (params: EditableCallbackParams<R>) => {
          if (gridMode !== "edit") return false;

          if (!isCellVisible(cell, params.node)) return false;

          if (addable && getRowState(params.node) !== "new") return false;

          const editable = columnDef.editable;

          return typeof editable === "function"
            ? editable(params)
            : (editable ?? false);
        },
        headerClass:
          gridMode === "edit"
            ? [
                required && "ag-header-required",
                columnDef.editable && !addable && "ag-header-editable",
              ].filter((className): className is string => !!className)
            : undefined,
        cellRenderer: cell?.visible
          ? (params: ICellRendererParams<R>) => {
              if (!isCellVisible(cell, params.node)) return null;

              if (!baseCellRenderer) {
                return params.valueFormatted ?? params.value;
              }

              return createElement(baseCellRenderer, params);
            }
          : baseCellRenderer,
        cellEditor:
          columnDef.cellEditor ??
          (type
            ? {
                text: TextCellEditor,
                select: SelectCellEditor,
                "multi-select": MultiSelectCellEditor,
                number: NumberCellEditor,
                checkbox: CheckboxCellEditor,
                date: DateCellEditor,
                button: undefined,
              }[type]
            : undefined),
        cellClassRules: {
          ...columnDef.cellClassRules,
          "ag-cell-edited": isCellEdited,
        },
        cellStyle: {
          ...columnDef.cellStyle,
          textAlign: align,
          justifyContent: {
            left: "flex-start",
            center: "center",
            right: "flex-end",
          }[align],
        },
      };
    });

    if (!normalizedColumnDefs) return normalizedColumnDefs;

    if (gridMode === "edit") {
      return [
        {
          colId: "editStatus",
          headerName: translate(TRANSLATION_KEY.common.label.STATUS),
          width: GRID_WIDTH.xs,
          pinned: "left" as const,
          cellStyle: { display: "flex", justifyContent: "center" },
          cellRenderer: (params: ICellRendererParams<R>) => {
            const rowState = params.node.id
              ? rowStatesRef.current.get(params.node.id)?.state
              : undefined;
            const hasRowState = ["new", "edited", "deleted"].includes(
              rowState ?? "",
            );

            return hasRowState
              ? createElement(Icon, {
                  iconName: ((): IconName | undefined => {
                    switch (rowState) {
                      case "new":
                        return "AddCircleOutlined";
                      case "edited":
                        return "EditOutlined";
                      case "deleted":
                        return "DeleteOutlined";
                      default:
                        return undefined;
                    }
                  })()!,
                  size: "small",
                })
              : null;
          },
        },
        ...normalizedColumnDefs,
      ];
    }

    if (onDetail) {
      return [
        ...normalizedColumnDefs,
        {
          colId: DETAIL_COL_ID,
          headerName: translate(TRANSLATION_KEY.common.label.DETAIL),
          width: GRID_WIDTH.xs,
          pinned: "right" as const,
          cellStyle: { display: "flex", justifyContent: "center" },
          cellRenderer: (params: ICellRendererParams<R>) => {
            if (!params.data) return null;

            return createElement(IconButton, {
              iconName: "OpenInNew",
              onClick: () => onDetail(params.data as R),
            });
          },
        },
      ];
    }

    return normalizedColumnDefs;
  })();

  return resolvedColumnDefs;
}
