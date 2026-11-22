import { DialogProps, Drawer } from "@mui/material";

export function PickerBottomSheet({ open, children, onClose }: DialogProps) {
  const handleClose = () => {
    onClose?.({}, "backdropClick");
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={handleClose}>
      {children}
    </Drawer>
  );
}
