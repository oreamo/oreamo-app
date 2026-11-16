import { DetailForm } from "@/components/data-form/components/DetailForm";
import { MultiSelectInputField } from "@/components/data-form/components/MultiSelectInputField";
import { NumberInputField } from "@/components/data-form/components/NumberInputField";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { Role, RolePermission } from "@/models/authority-model";
import { DetailFormModal } from "@/pages/setting/system/_components/DetailFormModal";
import { usePermissionInfos } from "@/resources/authority/usePermissionInfos";
import { useRole } from "@/resources/authority/useRole";
import { useRoleDelete } from "@/resources/authority/useRoleDelete";
import { useRoleSave } from "@/resources/authority/useRoleSave";
import { useRoleUpdate } from "@/resources/authority/useRoleUpdate";
import { useMenuInfos } from "@/resources/menu/useMenuInfos";

interface RoleForm extends Role {
  rolePermissionKeys?: string[];
}

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

  const { data: menuInfos = [] } = useMenuInfos();
  const { data: permissionInfos = [] } = usePermissionInfos();

  const { mutate: saveRole } = useRoleSave();
  const { mutate: updateRole } = useRoleUpdate({ roleCode: roleValue });
  const { mutate: deleteRole } = useRoleDelete({ roleCode: roleValue });

  const toRolePermissionKey = (rolePermission: RolePermission) => {
    return `${rolePermission.menuId}:${rolePermission.permissionCode}`;
  };

  const toRolePermission = (rolePermissionKey: string): RolePermission => {
    const [menuId, permissionCode] = rolePermissionKey.split(":");
    return { menuId, permissionCode };
  };

  const handleSubmit = (data: RoleForm, options: { onSuccess: () => void }) => {
    const rolePermissions = (data.rolePermissionKeys ?? []).map(
      toRolePermission,
    );

    if (isEditMode) {
      updateRole(
        {
          roleCode: data.roleCode,
          roleName: data.roleName,
          sortOrder: data.sortOrder,
          dataStatus: data.dataStatus,
          rolePermissions,
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
        rolePermissions,
      },
      options,
    );
  };

  const handleDelete = (options: { onSuccess: () => void }) => {
    deleteRole({ roleCode: roleValue as string }, options);
  };

  const roleForm = role && {
    ...role,
    rolePermissionKeys: role.rolePermissions?.map(toRolePermissionKey),
  };

  const rolePermissionOptions = menuInfos.flatMap((menuInfo) =>
    permissionInfos.map((permissionInfo) => ({
      value: toRolePermissionKey({
        menuId: menuInfo.menuId,
        permissionCode: permissionInfo.permissionCode,
      }),
      label: `${menuInfo.menuName} ${permissionInfo.permissionName}`,
    })),
  );

  return (
    <DetailFormModal<RoleForm>
      open={open}
      keyValue={roleValue}
      labelKey={TRANSLATION_KEY.authority.label.ROLE}
      formValue={roleForm}
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
        <TextInputField<RoleForm, "roleCode">
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
        <TextInputField<RoleForm, "roleName">
          name="roleName"
          label={translate(TRANSLATION_KEY.authority.label.ROLE_NAME)}
          required
          readonly={readonly}
          maxLength={100}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.authority.label.PERMISSION)}
      >
        <MultiSelectInputField<RoleForm, "rolePermissionKeys">
          name="rolePermissionKeys"
          label={translate(TRANSLATION_KEY.authority.label.PERMISSION)}
          readonly={readonly}
          options={rolePermissionOptions}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.SORT_ORDER)}
        required
      >
        <NumberInputField<RoleForm, "sortOrder">
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
        <SelectInputField<RoleForm, "dataStatus">
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
