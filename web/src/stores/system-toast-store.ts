import { AlertColor } from "@mui/material";
import { create } from "zustand";

type SystemToastState = {
  id: number;
  open: boolean;
  type: AlertColor;
  message: string;
};

type SystemToastAction = {
  toast: (params: { type?: AlertColor; message: string }) => void;
  close: () => void;
};

type SystemToastStore = SystemToastState & SystemToastAction;

export const useSystemToastStore = create<SystemToastStore>((set) => ({
  id: 0,
  open: false,
  type: "info",
  message: "",
  toast: ({ type = "info", message }) =>
    set((state) => ({ id: state.id + 1, open: true, type, message })),
  close: () => set({ open: false }),
}));

export function useSystemToast() {
  return useSystemToastStore((store) => store.toast);
}
