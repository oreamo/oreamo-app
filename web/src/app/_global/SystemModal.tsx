import { Text } from "@/components/common/display/Text";
import { Modal } from "@/components/common/overlay/Modal";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { useSystemDialogStore } from "@/stores/system-dialog-store";

export function SystemModal() {
  const { translate } = useTranslate();

  const { open, type, content, actions, close } = useSystemDialogStore();

  const handleConfirm = () => {
    close();
    if (type === "confirm" && actions.onConfirm) {
      actions.onConfirm();
    }
  };

  const handleCancel = () => {
    actions.onCancel?.();
    close();
  };

  const handleClose = () => {
    close();
    if (type === "confirm" && actions.onCancel) {
      actions.onCancel();
    }

    if (type === "alert" && actions.onClose) {
      actions.onClose();
    }
  };

  return (
    <Modal
      open={open}
      title={
        type === "alert"
          ? translate(TRANSLATION_KEY.common.label.ALERT)
          : translate(TRANSLATION_KEY.common.label.CONFIRM)
      }
      size="small"
      actions={(() => {
        if (type === "alert") {
          return [
            {
              variant: "contained",
              label: translate(TRANSLATION_KEY.common.label.CLOSE),
              onClick: handleClose,
            },
          ];
        }

        if (type === "confirm") {
          return [
            {
              variant: "outlined",
              label: translate(TRANSLATION_KEY.common.label.CANCEL),
              onClick: handleCancel,
            },
            {
              variant: "contained",
              label: translate(TRANSLATION_KEY.common.label.CONFIRM),
              onClick: handleConfirm,
            },
          ];
        }
      })()}
      onClose={handleClose}
    >
      <Text whiteSpace="pre-line">{content}</Text>
    </Modal>
  );
}
