import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import { encryptStorage } from "@/libs/encrypt-storage";

type SidebarState = {
  open: boolean;
};

type SidebarAction = {
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

type SidebarStore = SidebarState & SidebarAction;

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      open: true,
      setOpen: (open) => set({ open }),
      toggle: () => set((state) => ({ open: !state.open })),
    }),
    {
      name: "sidebar",
      storage: createJSONStorage(() => encryptStorage),
      partialize: (state) => ({ open: state.open }),
    },
  ),
);

export function useSidebarOpen() {
  return useSidebarStore((store) => store.open);
}

export function useSidebarActions() {
  return useSidebarStore(
    useShallow((store) => ({
      setOpen: store.setOpen,
      toggle: store.toggle,
    })),
  );
}
