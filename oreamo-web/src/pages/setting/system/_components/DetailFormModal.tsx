import { ReactNode } from "react";

import { FieldValues } from "react-hook-form";

import { Modal } from "@/components/common/overlay/Modal";
import { DetailForm } from "@/components/data-form/components/DetailForm";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { useSystemConfirm } from "@/stores/system-dialog-store";
import { useSystemToast } from "@/stores/system-toast-store";

interface MutateOptions {
  onSuccess: () => void;
}

interface DetailFormModalProps<TFieldValues extends FieldValues> {
  open: boolean;
  keyValue?: string;
  labelKey: string;
  formValue?: TFieldValues;
  isEditMode: boolean;
  readonly?: boolean;
  getTargetValue: (data: TFieldValues) => string;
  onSubmit: (data: TFieldValues, options: MutateOptions) => void;
  onDelete?: (options: MutateOptions) => void;
  onClose: () => void;
  children: ReactNode;
}

export function DetailFormModal<TFieldValues extends FieldValues>({
  open,
  keyValue,
  labelKey,
  formValue,
  isEditMode,
  readonly = false,
  getTargetValue,
  onSubmit,
  onDelete,
  onClose,
  children,
}: DetailFormModalProps<TFieldValues>) {
  const { translate } = useTranslate();
  const confirm = useSystemConfirm();
  const toast = useSystemToast();

  const { form, handleSubmit, handleEnter } = useDataForm<TFieldValues>({
    values: formValue,
    onValid: (data) => {
      const targetValue = getTargetValue(data);

      const confirmMessage = isEditMode
        ? translate(TRANSLATION_KEY.common.message.UPDATE_CONFIRM, {
            updateTarget: labelKey,
            updateTargetValue: targetValue,
          })
        : translate(TRANSLATION_KEY.common.message.CREATE_CONFIRM, {
            createTarget: labelKey,
            createTargetValue: targetValue,
          });

      const successMessage = isEditMode
        ? translate(TRANSLATION_KEY.common.message.UPDATE_SUCCESS, {
            updateTarget: labelKey,
            updateTargetValue: targetValue,
          })
        : translate(TRANSLATION_KEY.common.message.CREATE_SUCCESS, {
            createTarget: labelKey,
            createTargetValue: targetValue,
          });

      confirm({
        content: confirmMessage,
        onConfirm: () => {
          onSubmit(data, {
            onSuccess: () => {
              toast({ type: "success", message: successMessage });
              onClose();
            },
          });
        },
      });
    },
  });

  const handleDelete = () => {
    if (!onDelete || !keyValue) return;

    confirm({
      content: translate(TRANSLATION_KEY.common.message.DELETE_CONFIRM, {
        deleteTarget: labelKey,
        deleteTargetValue: keyValue,
      }),
      onConfirm: () => {
        onDelete({
          onSuccess: () => {
            toast({
              type: "success",
              message: translate(
                TRANSLATION_KEY.common.message.DELETE_SUCCESS,
                {
                  deleteTarget: labelKey,
                  deleteTargetValue: keyValue,
                },
              ),
            });
            onClose();
          },
        });
      },
    });
  };

  return (
    <Modal
      open={open}
      title={translate(labelKey)}
      actions={[
        {
          variant: "outlined",
          label: !readonly
            ? translate(TRANSLATION_KEY.common.label.CANCEL)
            : translate(TRANSLATION_KEY.common.label.CLOSE),
          onClick: onClose,
        },
        ...(!readonly
          ? [
              {
                variant: "contained" as const,
                label: isEditMode
                  ? translate(TRANSLATION_KEY.common.label.EDIT)
                  : translate(TRANSLATION_KEY.common.label.SAVE),
                onClick: handleSubmit,
              },
            ]
          : []),
        ...(isEditMode && !readonly && onDelete
          ? [
              {
                variant: "contained" as const,
                label: translate(TRANSLATION_KEY.common.label.DELETE),
                enableLock: true,
                onClick: handleDelete,
              },
            ]
          : []),
      ]}
      onClose={onClose}
    >
      <DetailForm form={form} onEnter={handleEnter}>
        {children}
      </DetailForm>
    </Modal>
  );
}
