import { useDataGridRegisterEffect } from "@/components/data-grid/_hooks/useDataGridRegisterEffect";
import {
  DataGridRegistration,
  useDataGridStore,
} from "@/components/data-grid/_stores/data-grid-store";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { useSystemConfirm } from "@/stores/system-dialog-store";
import { GridMode } from "@/types/ag-grid";

interface UseDataGridInterconnectionOptions {
  gridId?: string;
  childGridIds?: string[];
  hasPendingChanges: () => boolean;
  discardChanges: () => void;
  onModeChange: (mode: GridMode) => void;
}

export function useDataGridInterconnection({
  gridId,
  childGridIds = [],
  hasPendingChanges,
  discardChanges,
  onModeChange,
}: UseDataGridInterconnectionOptions) {
  const getGrid = useDataGridStore((store) => store.getGrid);
  const confirm = useSystemConfirm();
  const { translate } = useTranslate();

  const getChildGrids = () => {
    return childGridIds
      .map((childGridId) => getGrid(childGridId))
      .filter((grid): grid is DataGridRegistration => !!grid);
  };

  const hasPendingChangesWithChildren = () => {
    return (
      hasPendingChanges() ||
      getChildGrids().some((grid) => grid.hasPendingChanges())
    );
  };

  const resetWithChildren = () => {
    discardChanges();
    onModeChange("read");
    getChildGrids().forEach((grid) => grid.reset());
  };

  useDataGridRegisterEffect({
    gridId,
    hasPendingChanges: hasPendingChangesWithChildren,
    reset: resetWithChildren,
  });

  const runAfterChildrenReset = (action: () => void) => {
    const childGrids = getChildGrids();

    const resetChildrenAndRun = () => {
      childGrids.forEach((grid) => grid.reset());
      action();
    };

    if (!childGrids.some((grid) => grid.hasPendingChanges())) {
      resetChildrenAndRun();
      return;
    }

    confirm({
      content: translate(
        TRANSLATION_KEY.common.message.DISCARD_CHANGES_CONFIRM,
      ),
      onConfirm: resetChildrenAndRun,
    });
  };

  return {
    runAfterChildrenReset,
  };
}
