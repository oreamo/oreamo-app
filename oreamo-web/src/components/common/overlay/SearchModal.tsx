import { ReactNode } from "react";

import { Modal } from "@/components/common/overlay/Modal";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";

export interface SearchModalProps {
  title: string;
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SearchModal({
  title,
  children,
  onConfirm,
  onCancel,
}: SearchModalProps) {
  const { translate } = useTranslate();

  return (
    <Modal
      open
      title={title}
      size={"large"}
      actions={[
        {
          label: translate(TRANSLATION_KEY.common.label.CANCEL),
          variant: "outlined",
          onClick: onCancel,
        },
        {
          label: translate(TRANSLATION_KEY.common.label.CONFIRM),
          variant: "contained",
          onClick: onConfirm,
        },
      ]}
      onClose={onCancel}
    >
      {children}
    </Modal>
  );
}
