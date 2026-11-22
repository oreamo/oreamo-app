import { DetailForm } from "@/components/data-form/components/DetailForm";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { User } from "@/models/user-model";
import { DetailFormModal } from "@/pages/setting/system/_components/DetailFormModal";
import { useRoleInfos } from "@/resources/authority/useRoleInfos";
import { useUser } from "@/resources/user/useUser";
import { useUserDelete } from "@/resources/user/useUserDelete";
import { useUserSave } from "@/resources/user/useUserSave";
import { useUserUpdate } from "@/resources/user/useUserUpdate";

interface UserDialogProps {
  open: boolean;
  userValue?: string;
  readonly?: boolean;
  onClose: () => void;
}

export function UserDialog({
  open,
  userValue,
  readonly = false,
  onClose,
}: UserDialogProps) {
  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { data: user, isEnabled: isEditMode } = useUser({
    username: userValue,
  });

  const { data: roleInfos } = useRoleInfos();

  const { mutate: saveUser } = useUserSave();
  const { mutate: updateUser } = useUserUpdate({ username: userValue });
  const { mutate: deleteUser } = useUserDelete({ username: userValue });

  const roleOptions = (roleInfos ?? []).map((roleInfo) => ({
    value: roleInfo.roleCode,
    label: roleInfo.roleName,
  }));

  const handleSubmit = (data: User, options: { onSuccess: () => void }) => {
    if (!isEditMode) {
      saveUser(
        {
          username: data.username,
          name: data.name,
          email: data.email,
          roleCode: data.roleCode,
          dataStatus: data.dataStatus,
        },
        options,
      );
      return;
    }

    updateUser(
      {
        username: data.username,
        name: data.name,
        email: data.email,
        roleCode: data.roleCode,
        dataStatus: data.dataStatus,
      },
      options,
    );
  };

  const handleDelete = (options: { onSuccess: () => void }) => {
    deleteUser({ username: userValue as string }, options);
  };

  return (
    <DetailFormModal<User>
      open={open}
      keyValue={userValue}
      labelKey={TRANSLATION_KEY.user.label.USER}
      formValue={user ?? ({} as User)}
      isEditMode={isEditMode}
      readonly={readonly}
      getTargetValue={(data) => data.username}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onClose={onClose}
    >
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.user.label.USERNAME)}
        required
      >
        <TextInputField<User, "username">
          name="username"
          label={translate(TRANSLATION_KEY.user.label.USERNAME)}
          required
          readonly={isEditMode || readonly}
          maxLength={50}
          validation={{
            minLength: (value) => {
              return value && value.length < 6
                ? translate(
                    TRANSLATION_KEY.common.message.MIN_SIZE_VALIDATION_FAILURE,
                    {
                      target: TRANSLATION_KEY.user.label.USERNAME,
                      minValue: "6",
                    },
                  )
                : undefined;
            },
          }}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.user.label.NAME)}
        required
      >
        <TextInputField<User, "name">
          name="name"
          label={translate(TRANSLATION_KEY.user.label.NAME)}
          required
          readonly={readonly}
          maxLength={100}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.user.label.EMAIL)}
        required
      >
        <TextInputField<User, "email">
          name="email"
          label={translate(TRANSLATION_KEY.user.label.EMAIL)}
          required
          readonly={readonly}
          maxLength={100}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.authority.label.ROLE)}
        required
      >
        <SelectInputField<User, "roleCode">
          name="roleCode"
          label={translate(TRANSLATION_KEY.authority.label.ROLE)}
          required
          readonly={readonly}
          options={roleOptions}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
        required
      >
        <SelectInputField<User, "dataStatus">
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
