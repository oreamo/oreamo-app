import { RefObject, useRef } from "react";

import type {
  CellEditingStartedEvent,
  CellValueChangedEvent,
  IRowNode,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";

import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { DataStatus } from "@/models/common-model";
import { useSystemConfirm } from "@/stores/system-dialog-store";
import { RowEditState } from "@/types/ag-grid";

interface UseDataGridRowStatesOptions<R extends object> {
  gridRef: RefObject<AgGridReact<R> | null>;
  rowDefaultValue?: Partial<R>;
}

export function useDataGridRowStates<R extends object>({
  gridRef,
  rowDefaultValue,
}: UseDataGridRowStatesOptions<R>) {
  const rowStatesRef = useRef<
    Map<string, { state: RowEditState; original?: R }>
  >(new Map());

  const { translate } = useTranslate();
  const confirm = useSystemConfirm();

  const getPendingRowStateEntries = () => {
    return Array.from(rowStatesRef.current.entries()).filter(
      ([, rowState]) => rowState.state !== "exist",
    );
  };

  const hasPendingChanges = () => {
    return getPendingRowStateEntries().length > 0;
  };

  const discardChanges = () => {
    const nodesToRedraw: IRowNode<R>[] = [];

    getPendingRowStateEntries().forEach(([id, rowState]) => {
      const node = gridRef.current?.api.getRowNode(id);

      if (!node) return;

      if (rowState.state === "new" && node.data) {
        gridRef.current?.api.applyTransaction({ remove: [node.data] });
        return;
      }

      if (rowState.original) {
        node.setData(rowState.original);
      }

      nodesToRedraw.push(node);
    });

    gridRef.current?.api.redrawRows({ rowNodes: nodesToRedraw });

    rowStatesRef.current.clear();
  };

  const removeNewNodesFromGrid = (
    selectedNodes: IRowNode<R>[],
  ): IRowNode<R>[] => {
    const newNodes = selectedNodes.filter((node) => {
      return node.id && rowStatesRef.current.get(node.id)?.state === "new";
    });
    const otherNodes = selectedNodes.filter((node) => {
      return !newNodes.includes(node);
    });

    if (newNodes.length > 0) {
      gridRef.current?.api.applyTransaction({
        remove: newNodes
          .map((node) => node.data)
          .filter((data): data is R => !!data),
      });

      newNodes.forEach((node) => {
        if (!node.id) return;

        rowStatesRef.current.delete(node.id);
      });
    }

    return otherNodes;
  };

  const addRow = () => {
    const result = gridRef.current?.api.applyTransaction({
      addIndex: 0,
      add: [{ ...rowDefaultValue } as R],
    });

    const addedNodes = result?.add ?? [];

    addedNodes.forEach((node) => {
      if (!node.id) return;

      rowStatesRef.current.set(node.id, { state: "new" });
    });

    if (addedNodes.length > 0) {
      gridRef.current?.api.redrawRows({ rowNodes: addedNodes });
    }
  };

  const removeRow = () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];
    const otherNodes = removeNewNodesFromGrid(selectedNodes);

    otherNodes.forEach((node) => {
      if (!node.id || !node.data) return;

      const current = rowStatesRef.current.get(node.id);

      rowStatesRef.current.set(node.id, {
        state: "edited",
        original: current?.original ?? { ...node.data },
      });
      node.setData({
        ...node.data,
        dataStatus: DataStatus.DISABLED,
      } as R);
    });

    gridRef.current?.api.redrawRows({ rowNodes: otherNodes });
    gridRef.current?.api.deselectAll();
  };

  const deleteRow = () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];
    const otherNodes = removeNewNodesFromGrid(selectedNodes);

    otherNodes.forEach((node) => {
      if (!node.id) return;

      const current = rowStatesRef.current.get(node.id);

      rowStatesRef.current.set(node.id, {
        state: "deleted",
        original:
          current?.original ?? (node.data ? { ...node.data } : undefined),
      });
    });

    gridRef.current?.api.redrawRows({ rowNodes: otherNodes });
    gridRef.current?.api.deselectAll();
  };

  const restoreRow = () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];

    if (selectedNodes.length === 0) {
      if (!hasPendingChanges()) return;

      confirm({
        content: translate(
          TRANSLATION_KEY.common.message.DISCARD_CHANGES_CONFIRM,
        ),
        onConfirm: () => discardChanges(),
      });
      return;
    }

    selectedNodes.forEach((node) => {
      if (!node.id) return;

      const current = rowStatesRef.current.get(node.id);

      if (current?.state === "new") {
        node.setData({} as R);
        return;
      }

      if (current?.original) {
        node.setData(current.original);
      }

      rowStatesRef.current.delete(node.id);
    });

    gridRef.current?.api.redrawRows({ rowNodes: selectedNodes });
    gridRef.current?.api.deselectAll();
  };

  const getChanges = () => {
    const entries = getPendingRowStateEntries();

    const newRows = entries
      .filter(([, rowState]) => rowState.state === "new")
      .map(([id]) => gridRef.current?.api.getRowNode(id)?.data)
      .filter((data): data is R => !!data);

    const editedRows = entries
      .filter(([, rowState]) => rowState.state === "edited")
      .map(([id]) => gridRef.current?.api.getRowNode(id)?.data)
      .filter((data): data is R => !!data);

    const deletedRows = entries
      .filter(([, rowState]) => rowState.state === "deleted")
      .map(([id]) => gridRef.current?.api.getRowNode(id)?.data)
      .filter((data): data is R => !!data);

    return { newRows, editedRows, deletedRows };
  };

  const resetChanges = () => {
    rowStatesRef.current.clear();
  };

  const handleRowCellEditingStarted = (event: CellEditingStartedEvent<R>) => {
    const id = event.node.id;
    const state = id ? rowStatesRef.current.get(id)?.state : undefined;

    if (id && (!state || state === "exist") && event.data) {
      rowStatesRef.current.set(id, {
        state: "exist",
        original: { ...event.data },
      });
    }
  };

  const handleRowCellValueChanged = (event: CellValueChangedEvent<R>) => {
    const id = event.node.id;
    const current = id ? rowStatesRef.current.get(id) : undefined;

    if (id && (!current || current.state === "exist")) {
      rowStatesRef.current.set(id, {
        state: "edited",
        original: current?.original,
      });
      gridRef.current?.api.redrawRows({ rowNodes: [event.node] });
    }
  };

  return {
    rowStatesRef,
    addRow,
    removeRow,
    deleteRow,
    restoreRow,
    hasPendingChanges,
    discardChanges,
    getChanges,
    resetChanges,
    handleRowCellEditingStarted,
    handleRowCellValueChanged,
  };
}
