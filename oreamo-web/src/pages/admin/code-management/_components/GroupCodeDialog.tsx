import { DetailForm } from "@/components/data-form/components/DetailForm";
import { NumberInputField } from "@/components/data-form/components/NumberInputField";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextareaField } from "@/components/data-form/components/TextareaField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { GroupCode } from "@/models/code-model";
import { DetailFormModal } from "@/pages/admin/_components/DetailFormModal";
import { useGroupCode } from "@/resources/code/useGroupCode";
import { useGroupCodeDelete } from "@/resources/code/useGroupCodeDelete";
import { useGroupCodeSave } from "@/resources/code/useGroupCodeSave";
import { useGroupCodeUpdate } from "@/resources/code/useGroupCodeUpdate";

interface GroupCodeDialogProps {
  open: boolean;
  groupCodeValue?: string;
  readonly?: boolean;
  onClose: () => void;
}

export function GroupCodeDialog({
  open,
  groupCodeValue,
  readonly = false,
  onClose,
}: GroupCodeDialogProps) {
  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { data: groupCode, isEnabled: isEditMode } = useGroupCode({
    groupCode: groupCodeValue,
  });
  const { mutate: saveGroupCode } = useGroupCodeSave();
  const { mutate: updateGroupCode } = useGroupCodeUpdate({
    groupCode: groupCodeValue,
  });
  const { mutate: deleteGroupCode } = useGroupCodeDelete({
    groupCode: groupCodeValue,
  });

  const handleSubmit = (
    data: GroupCode,
    options: { onSuccess: () => void },
  ) => {
    const mutate = isEditMode ? updateGroupCode : saveGroupCode;

    mutate(data, options);
  };

  const handleDelete = (options: { onSuccess: () => void }) => {
    deleteGroupCode({ groupCode: groupCodeValue as string }, options);
  };

  return (
    <DetailFormModal<GroupCode>
      open={open}
      keyValue={groupCodeValue}
      labelKey={TRANSLATION_KEY.code.label.GROUP_CODE}
      formValue={groupCode}
      isEditMode={isEditMode}
      readonly={readonly}
      getTargetValue={(data) => data.groupCode}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onClose={onClose}
    >
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.code.label.GROUP_CODE)}
        required
      >
        <TextInputField<GroupCode, "groupCode">
          name="groupCode"
          label={translate(TRANSLATION_KEY.code.label.GROUP_CODE)}
          required
          readonly={isEditMode || readonly}
          maxLength={50}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.code.label.GROUP_CODE_NAME)}
        required
      >
        <TextInputField<GroupCode, "groupCodeName">
          name="groupCodeName"
          label={translate(TRANSLATION_KEY.code.label.GROUP_CODE_NAME)}
          required
          readonly={readonly}
          maxLength={100}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.DESCRIPTION)}
      >
        <TextareaField<GroupCode, "groupCodeDescription">
          name="groupCodeDescription"
          label={translate(TRANSLATION_KEY.common.label.DESCRIPTION)}
          readonly={readonly}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.SORT_ORDER)}
        required
      >
        <NumberInputField<GroupCode, "sortOrder">
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
        <SelectInputField<GroupCode, "dataStatus">
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
