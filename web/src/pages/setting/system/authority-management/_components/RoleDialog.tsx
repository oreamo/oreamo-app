import { DetailForm } from "@/components/data-form/components/DetailForm";
import { NumberInputField } from "@/components/data-form/components/NumberInputField";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { Role } from "@/models/authority-model";
import { DetailFormModal } from "@/pages/setting/system/_components/DetailFormModal";
import { useRole } from "@/resources/authority/useRole";
import { useRoleDelete } from "@/resources/authority/useRoleDelete";
import { useRoleSave } from "@/resources/authority/useRoleSave";
import { useRoleUpdate } from "@/resources/authority/useRoleUpdate";

interface RoleDialogProps {
  open: boolean;
  roleValue?: string;
  readonly?: boolean;
  onClose: () => void;
}

export function RoleDialog({
  open,
  roleValue,
  readonly = false,
  onClose,
}: RoleDialogProps) {
  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { data: role, isEnabled: isEditMode } = useRole({
    roleCode: roleValue,
  });

  const { mutate: saveRole } = useRoleSave();
  const { mutate: updateRole } = useRoleUpdate({ roleCode: roleValue });
  const { mutate: deleteRole } = useRoleDelete({ roleCode: roleValue });

  const handleSubmit = (data: Role, options: { onSuccess: () => void }) => {
    if (isEditMode) {
      updateRole(
        {
          roleCode: data.roleCode,
          roleName: data.roleName,
          sortOrder: data.sortOrder,
          dataStatus: data.dataStatus,
        },
        options,
      );
      return;
    }

    saveRole(
      {
        roleCode: data.roleCode,
        roleName: data.roleName,
        sortOrder: data.sortOrder,
        dataStatus: data.dataStatus,
      },
      options,
    );
  };

  const handleDelete = (options: { onSuccess: () => void }) => {
    deleteRole({ roleCode: roleValue as string }, options);
  };

  return (
    <DetailFormModal<Role>
      open={open}
      keyValue={roleValue}
      labelKey={TRANSLATION_KEY.authority.label.ROLE}
      formValue={role}
      isEditMode={isEditMode}
      readonly={readonly}
      getTargetValue={(data) => data.roleCode}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onClose={onClose}
    >
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.authority.label.ROLE_CODE)}
        required
      >
        <TextInputField<Role, "roleCode">
          name="roleCode"
          label={translate(TRANSLATION_KEY.authority.label.ROLE_CODE)}
          required
          readonly={isEditMode || readonly}
          maxLength={50}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.authority.label.ROLE_NAME)}
        required
      >
        <TextInputField<Role, "roleName">
          name="roleName"
          label={translate(TRANSLATION_KEY.authority.label.ROLE_NAME)}
          required
          readonly={readonly}
          maxLength={100}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.SORT_ORDER)}
        required
      >
        <NumberInputField<Role, "sortOrder">
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
        <SelectInputField<Role, "dataStatus">
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
