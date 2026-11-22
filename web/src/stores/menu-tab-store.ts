import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import { encryptStorage } from "@/libs/encrypt-storage";

export type MenuTabItem = {
  menuId: string;
  menuName: string;
  url: string;
};

type MenuTabState = {
  enabled: boolean;
  tabs: MenuTabItem[];
  refreshKeys: Record<string, number>;
};

type MenuTabAction = {
  setEnabled: (enabled: boolean) => void;
  open: (tab: MenuTabItem) => void;
  close: (url: string) => void;
  closeOthers: (url: string) => void;
  refresh: (url: string) => void;
};

type MenuTabStore = MenuTabState & MenuTabAction;

export const useMenuTabStore = create<MenuTabStore>()(
  persist(
    (set) => ({
      enabled: true,
      tabs: [],
      refreshKeys: {},
      setEnabled: (enabled) =>
        set(enabled ? { enabled } : { enabled, tabs: [] }),
      open: (tab) =>
        set((state) => {
          if (state.tabs.some((prevTab) => prevTab.url === tab.url)) {
            return state;
          }

          return { tabs: [...state.tabs, tab] };
        }),
      close: (url) =>
        set((state) => ({
          tabs: state.tabs.filter((tab) => tab.url !== url),
        })),
      closeOthers: (url) =>
        set((state) => ({
          tabs: state.tabs.filter((tab) => tab.url === url),
        })),
      refresh: (url) =>
        set((state) => ({
          refreshKeys: {
            ...state.refreshKeys,
            [url]: (state.refreshKeys[url] ?? 0) + 1,
          },
        })),
    }),
    {
      name: "menu-tab",
      storage: createJSONStorage(() => encryptStorage),
      partialize: (state) => ({ enabled: state.enabled }),
    },
  ),
);

export function useMenuTabEnabled() {
  return useMenuTabStore((store) => store.enabled);
}

export function useMenuTabs() {
  return useMenuTabStore((store) => store.tabs);
}

export function useMenuTabRefreshKeys() {
  return useMenuTabStore((store) => store.refreshKeys);
}

export function useMenuTabActions() {
  return useMenuTabStore(
    useShallow((store) => ({
      setEnabled: store.setEnabled,
      open: store.open,
      close: store.close,
      closeOthers: store.closeOthers,
      refresh: store.refresh,
    })),
  );
}
