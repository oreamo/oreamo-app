import { DetailForm } from "@/components/data-form/components/DetailForm";
import { NumberInputField } from "@/components/data-form/components/NumberInputField";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { Permission } from "@/models/authority-model";
import { DetailFormModal } from "@/pages/setting/system/_components/DetailFormModal";
import { usePermission } from "@/resources/authority/usePermission";
import { usePermissionDelete } from "@/resources/authority/usePermissionDelete";
import { usePermissionSave } from "@/resources/authority/usePermissionSave";
import { usePermissionUpdate } from "@/resources/authority/usePermissionUpdate";

interface PermissionDialogProps {
  open: boolean;
  permissionValue?: string;
  readonly?: boolean;
  onClose: () => void;
}

export function PermissionDialog({
  open,
  permissionValue,
  readonly = false,
  onClose,
}: PermissionDialogProps) {
  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { data: permission, isEnabled: isEditMode } = usePermission({
    permissionCode: permissionValue,
  });

  const { mutate: savePermission } = usePermissionSave();
  const { mutate: updatePermission } = usePermissionUpdate({
    permissionCode: permissionValue,
  });
  const { mutate: deletePermission } = usePermissionDelete({
    permissionCode: permissionValue,
  });

  const handleSubmit = (
    data: Permission,
    options: { onSuccess: () => void },
  ) => {
    if (isEditMode) {
      updatePermission(
        {
          permissionCode: data.permissionCode,
          permissionName: data.permissionName,
          sortOrder: data.sortOrder,
          dataStatus: data.dataStatus,
        },
        options,
      );
      return;
    }

    savePermission(
      {
        permissionCode: data.permissionCode,
        permissionName: data.permissionName,
        sortOrder: data.sortOrder,
        dataStatus: data.dataStatus,
      },
      options,
    );
  };

  const handleDelete = (options: { onSuccess: () => void }) => {
    deletePermission({ permissionCode: permissionValue as string }, options);
  };

  return (
    <DetailFormModal<Permission>
      open={open}
      keyValue={permissionValue}
      labelKey={TRANSLATION_KEY.authority.label.PERMISSION}
      formValue={permission}
      isEditMode={isEditMode}
      readonly={readonly}
      getTargetValue={(data) => data.permissionCode}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onClose={onClose}
    >
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.authority.label.PERMISSION_CODE)}
        required
      >
        <TextInputField<Permission, "permissionCode">
          name="permissionCode"
          label={translate(TRANSLATION_KEY.authority.label.PERMISSION_CODE)}
          required
          readonly={isEditMode || readonly}
          maxLength={50}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.authority.label.PERMISSION_NAME)}
        required
      >
        <TextInputField<Permission, "permissionName">
          name="permissionName"
          label={translate(TRANSLATION_KEY.authority.label.PERMISSION_NAME)}
          required
          readonly={readonly}
          maxLength={100}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.SORT_ORDER)}
        required
      >
        <NumberInputField<Permission, "sortOrder">
          name="sortOrder"
          label={translate(TRANSLATION_KEY.common.label.SORT_ORDER)}
          required
          readonly={readonly}
          renderProps={{
            min: 1,
          }}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
        required
      >
        <SelectInputField<Permission, "dataStatus">
          name="dataStatus"
          label={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
          required
          readonly={readonly}
          options={getOptions("DATA_STATUS")}
        />
      </DetailForm.Item>
    </DetailFormModal>
  );
}
