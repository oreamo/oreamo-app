import { create } from "zustand";

export type DataGridRegistration = {
  hasPendingChanges: () => boolean;
  reset: () => void;
};

type DataGridState = {
  grids: Record<string, DataGridRegistration>;
};

type DataGridAction = {
  register: (gridId: string, registration: DataGridRegistration) => void;
  unregister: (gridId: string) => void;
  getGrid: (gridId: string) => DataGridRegistration | undefined;
};

type DataGridStore = DataGridState & DataGridAction;

export const useDataGridStore = create<DataGridStore>((set, get) => ({
  grids: {},
  register: (gridId, registration) =>
    set((state) => ({ grids: { ...state.grids, [gridId]: registration } })),
  unregister: (gridId) =>
    set((state) => {
      const { [gridId]: _, ...grids } = state.grids;
      return { grids };
    }),
  getGrid: (gridId) => get().grids[gridId],
}));
