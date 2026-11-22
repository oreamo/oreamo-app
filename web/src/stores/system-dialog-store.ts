import { create } from "zustand";

type SystemDialogState = {
  open: boolean;
  type: "alert" | "confirm";
  content: string;
  actions: {
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
  };
};

type SystemDialogAction = {
  confirm: (params: {
    content: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  alert: (params: { content: string; onClose?: () => void }) => void;
  close: () => void;
};

type SystemDialogStore = SystemDialogState & SystemDialogAction;

export const useSystemDialogStore = create<SystemDialogStore>((set) => ({
  open: false,
  type: "alert",
  content: "",
  actions: {},
  confirm: ({ content, onConfirm, onCancel }) =>
    set({
      open: true,
      type: "confirm",
      content,
      actions: { onConfirm, onCancel },
    }),
  alert: ({ content, onClose }) =>
    set({ open: true, type: "alert", content, actions: { onClose } }),
  close: () => set({ open: false, content: "", actions: {} }),
}));

export function useSystemAlert() {
  return useSystemDialogStore((store) => store.alert);
}

export function useSystemConfirm() {
  return useSystemDialogStore((store) => store.confirm);
}
