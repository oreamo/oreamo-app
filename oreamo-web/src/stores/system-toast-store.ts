import { create } from "zustand";

type SystemToastType = "info" | "success" | "warning" | "error";

type SystemToastState = {
  open: boolean;
  type: SystemToastType;
  message: string;
};

type SystemToastAction = {
  toast: (params: { type?: SystemToastType; message: string }) => void;
  close: () => void;
};

type SystemToastStore = SystemToastState & SystemToastAction;

export const useSystemToastStore = create<SystemToastStore>((set) => ({
  open: false,
  type: "info",
  message: "",
  toast: ({ type = "info", message }) => set({ open: true, type, message }),
  close: () => set({ open: false }),
}));

export function useSystemToast() {
  return useSystemToastStore((store) => store.toast);
}
