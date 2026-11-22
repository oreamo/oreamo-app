import { ChangeEvent, Ref, useRef, useState } from "react";

import { Pagination, styled, useTheme } from "@mui/material";
import { themeQuartz } from "ag-grid-community";
import type {
  CellClickedEvent,
  CellEditingStartedEvent,
  CellValueChangedEvent,
  GetRowIdParams,
  RowDataUpdatedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { AgGridReactProps } from "ag-grid-react";

import { Flex } from "@/components/common/layout/Flex";
import { DataGridToolbar } from "@/components/data-grid/_components/DataGridToolbar";
import {
  DETAIL_COL_ID,
  useDataGridColumns,
} from "@/components/data-grid/_hooks/useDataGridColumns";
import { useDataGridInterconnection } from "@/components/data-grid/_hooks/useDataGridInterconnection";
import { useDataGridRowStates } from "@/components/data-grid/_hooks/useDataGridRowStates";
import { PageInfo } from "@/models/common-model";
import { GridMode } from "@/types/ag-grid";

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 40;

export interface DataGridSavePayload<R> {
  newRows: R[];
  editedRows: R[];
  deletedRows: R[];
}

export interface DataGridSaveCallbacks {
  onSuccess: () => void;
}

export interface DataGridProps<R extends object> extends AgGridReactProps<R> {
  ref?: Ref<AgGridReact<R>>;
  gridId?: string;
  childGridIds?: string[];
  title?: string;
  pageInfo?: PageInfo<R>;
  visibleRowCount?: 5 | 10 | 20;
  readonly?: boolean;
  selectionMode?: "single" | "multi";
  enableSelectByClick?: boolean;
  selectedRows?: R[];
  rowDefaultValue?: Partial<R>;
  onAdd?: () => void;
  onDetail?: (data: R) => void;
  onSave?: (
    payload: DataGridSavePayload<R>,
    callbacks: DataGridSaveCallbacks,
  ) => void;
  onPaginationChange?: (page: number) => void;
  onSelectedRowChange?: (rows: R[]) => void;
}

export function DataGrid<R extends object>({
  ref,
  gridId,
  childGridIds,
  title,
  pageInfo,
  columnDefs,
  visibleRowCount = 10,
  readonly = false,
  selectionMode,
  enableSelectByClick = false,
  selectedRows,
  rowDefaultValue,
  getRowId,
  onAdd: handleAdd,
  onDetail,
  onSave,
  onPaginationChange,
  onSelectedRowChange,
  onCellValueChanged,
  onCellClicked,
  onCellEditingStarted,
  ...agGridProps
}: DataGridProps<R>) {
  const gridRef = useRef<AgGridReact<R>>(null);

  const theme = useTheme();

  const [gridMode, setGridMode] = useState<GridMode>("read");

  const {
    rowStatesRef,
    addRow: handleRowAdd,
    removeRow: handleRowRemove,
    deleteRow: handleRowDelete,
    restoreRow: handleRowRestore,
    hasPendingChanges,
    discardChanges,
    getChanges,
    resetChanges,
    handleRowCellEditingStarted,
    handleRowCellValueChanged,
  } = useDataGridRowStates<R>({ gridRef, rowDefaultValue });

  const resolvedColumnDefs = useDataGridColumns<R>({
    rowStatesRef,
    columnDefs,
    gridMode,
    onDetail,
  });

  const { runAfterChildrenReset } = useDataGridInterconnection({
    gridId,
    childGridIds,
    hasPendingChanges,
    discardChanges,
    onModeChange: setGridMode,
  });

  const gridHeight = HEADER_HEIGHT + ROW_HEIGHT * visibleRowCount;

  const gridTheme = themeQuartz.withParams({
    browserColorScheme: theme.palette.mode,
    backgroundColor: theme.palette.surface.raised,
    foregroundColor: theme.palette.scale[800],
    borderColor: theme.palette.scale[200],
  });

  const handleCellEditingStarted = (event: CellEditingStartedEvent<R>) => {
    handleRowCellEditingStarted(event);
    onCellEditingStarted?.(event);
  };

  const handleCellValueChanged = (event: CellValueChangedEvent<R>) => {
    handleRowCellValueChanged(event);
    onCellValueChanged?.(event);
  };

  const handleCellClicked = (event: CellClickedEvent<R>) => {
    if (gridMode === "edit") return;
    if (event.column.getColId() === DETAIL_COL_ID) return;

    runAfterChildrenReset(() => {
      if (enableSelectByClick && selectionMode) {
        event.node.setSelected(!event.node.isSelected());
      }

      onCellClicked?.(event);
    });
  };

  const resolveRowId = (row: R) => {
    if (!getRowId) return row;
    return getRowId({ data: row } as GetRowIdParams<R>);
  };

  const handleSelectionChanged = (event: SelectionChangedEvent<R>) => {
    const nowSelected = event.api.getSelectedRows();

    if (!selectedRows) {
      onSelectedRowChange?.(nowSelected);
      return;
    }

    const visibleIds = new Set<R | string>();
    event.api.forEachNode((node) => {
      if (node.data) visibleIds.add(resolveRowId(node.data));
    });

    const preserved = selectedRows.filter(
      (item) => !visibleIds.has(resolveRowId(item)),
    );

    onSelectedRowChange?.([...preserved, ...nowSelected]);
  };

  const handleRowDataUpdated = (event: RowDataUpdatedEvent<R>) => {
    if (!selectedRows) return;

    const selectedIds = new Set(selectedRows.map(resolveRowId));

    event.api.forEachNode((node) => {
      if (!node.data) return;
      node.setSelected(selectedIds.has(resolveRowId(node.data)));
    });
  };

  const handlePaginationChange = (_: ChangeEvent<unknown>, page: number) => {
    runAfterChildrenReset(() => {
      onPaginationChange?.(page);
    });
  };

  return (
    <Flex direction="column">
      <DataGridToolbar<R>
        title={title}
        mode={gridMode}
        pageInfo={pageInfo}
        readonly={readonly}
        hasPendingChanges={hasPendingChanges}
        discardChanges={discardChanges}
        getChanges={getChanges}
        resetChanges={resetChanges}
        onAdd={handleAdd}
        onAddRow={handleRowAdd}
        onRemoveRow={handleRowRemove}
        onDeleteRow={handleRowDelete}
        onRestoreRow={handleRowRestore}
        onModeChange={setGridMode}
        onSave={onSave}
      />
      <StyledDataGridWrapper direction="column">
        <StyledDataGridGroup direction="column" height={gridHeight}>
          <AgGridReact<R>
            ref={(instance) => {
              gridRef.current = instance;

              if (typeof ref === "function") {
                ref(instance);
                return;
              }

              if (ref) {
                ref.current = instance;
              }
            }}
            theme={gridTheme}
            rowHeight={ROW_HEIGHT}
            headerHeight={HEADER_HEIGHT}
            singleClickEdit
            stopEditingWhenCellsLoseFocus
            {...agGridProps}
            columnDefs={resolvedColumnDefs}
            rowSelection={
              gridMode === "edit" || selectionMode
                ? {
                    mode:
                      gridMode !== "edit" && selectionMode === "single"
                        ? "singleRow"
                        : "multiRow",
                    checkboxes: true,
                    headerCheckbox: false,
                  }
                : undefined
            }
            selectionColumnDef={{
              pinned: "left",
              headerStyle: { display: "flex", justifyContent: "center" },
              cellStyle: { display: "flex", justifyContent: "center" },
            }}
            getRowId={getRowId}
            onCellValueChanged={handleCellValueChanged}
            onCellClicked={handleCellClicked}
            onCellEditingStarted={handleCellEditingStarted}
            onSelectionChanged={handleSelectionChanged}
            onRowDataUpdated={handleRowDataUpdated}
          />
        </StyledDataGridGroup>
      </StyledDataGridWrapper>
      <StyledPaginationContainer justify="center">
        <Pagination
          count={pageInfo?.pages ?? 1}
          page={pageInfo?.pageNum ?? 1}
          disabled={gridMode === "edit"}
          onChange={handlePaginationChange}
        />
      </StyledPaginationContainer>
    </Flex>
  );
}

const StyledDataGridWrapper = styled(Flex)(({ theme }) => ({
  overflow: "hidden",

  borderRadius: theme.shape.borderRadiusScale.lg,
  border: `1px solid ${theme.palette.scale[200]}`,
}));

const StyledDataGridGroup = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "height",
})<{ height: number }>(({ theme, height }) => ({
  height,

  "& .ag-root-wrapper": {
    backgroundColor: theme.palette.surface.raised,
    borderRadius: theme.shape.borderRadiusScale.lg,
    overflow: "hidden",

    "--ag-accent-color": theme.palette.brand.primary,
    "--ag-checkbox-checked-background-color": theme.palette.brand.primary,
    "--ag-checkbox-checked-border-color": theme.palette.brand.primary,
    "--ag-checkbox-checked-shape-color": theme.palette.getContrastText(
      theme.palette.brand.primary,
    ),
    "--ag-checkbox-unchecked-background-color": theme.palette.scale[0],
    "--ag-checkbox-unchecked-border-color": theme.palette.scale[300],
    "--ag-selected-row-background-color": theme.palette.scale[200],
    "--ag-row-hover-color": theme.palette.scale[100],
    "--ag-range-selection-border-color": theme.palette.scale[600],
    "--ag-focus-shadow": "none",
    "--ag-input-focus-border-color": theme.palette.brand.primary,
    "--ag-input-focus-box-shadow": "none",
  },

  "& .ag-header": {
    backgroundColor: theme.palette.scale[100],
    borderBottom: `1px solid ${theme.palette.scale[200]}`,
    color: theme.palette.scale[600],
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },

  "& .ag-header-cell-label": {
    justifyContent: "center",

    color: theme.palette.scale[500],
    fontWeight: theme.typography.button.fontWeight,
    fontSize: theme.typography.caption.fontSize,
  },

  "& .ag-header-cell-text": {
    position: "relative",
    overflow: "visible",
  },

  "& .ag-header-required .ag-header-cell-text::after": {
    content: '"*"',
    position: "absolute",
    top: -2,
    right: 0,
    transform: "translateX(calc(100% + 4px))",

    color: theme.palette.semantic.error,
    fontSize: theme.typography.overline.fontSize,
  },

  "& .ag-header-editable .ag-header-cell-text::before": {
    content: '"✎"',
    position: "absolute",
    top: 0,
    left: 0,
    transform: "translateX(calc(-100% - 4px))",

    color: theme.palette.semantic.info,
    fontSize: theme.typography.overline.fontSize,
  },

  "& .ag-header-cell-resize::after": {
    backgroundColor: theme.palette.scale[300],
  },

  "& .ag-row": {
    color: theme.palette.scale[800],
    fontSize: theme.typography.body2.fontSize,
    backgroundColor: "transparent",
    borderBottom: `1px solid ${theme.palette.scale[200]}`,
    transition: "background-color 0.15s ease",
  },

  "& .ag-row-hover": {
    backgroundColor: theme.palette.scale[100],
  },

  "& .ag-row-selected": {
    backgroundColor: theme.palette.scale[200],
  },

  "& .ag-row-selected.ag-row-hover": {
    backgroundColor: theme.palette.scale[300],
  },

  "& .ag-header-cell": {
    lineHeight: "40px",
    padding: "0 12px",
  },

  "& .ag-cell": {
    display: "flex",
    alignItems: "center",
  },

  "& .ag-cell svg": {
    verticalAlign: "middle",
  },

  "& .ag-cell-edited::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    borderTop: `6px solid ${theme.palette.semantic.info}`,
    borderRight: "6px solid transparent",
  },

  "& .ag-cell-inline-editing": {
    padding: "4px !important",

    border: "none !important",
    boxShadow: "none !important",
  },

  "& .ag-cell-focus": {
    boxShadow: "none !important",
    outline: "none !important",
  },

  "& .ag-selection-checkbox": {
    display: "flex !important",
    justifyContent: "center !important",
    margin: "0 auto !important",
    width: "100% !important",
  },

  "& .ag-body-viewport": {
    backgroundColor: "transparent",
  },

  "& .ag-center-cols-container": {
    backgroundColor: "transparent",
  },
}));

const StyledPaginationContainer = styled(Flex)(({ theme }) => ({
  padding: `${theme.spacing(1)} 0`,
}));
