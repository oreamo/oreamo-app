import { DetailForm } from "@/components/data-form/components/DetailForm";
import { NumberInputField } from "@/components/data-form/components/NumberInputField";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextareaField } from "@/components/data-form/components/TextareaField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { CommonCode } from "@/models/code-model";
import { DetailFormModal } from "@/pages/admin/_components/DetailFormModal";
import { useCommonCode } from "@/resources/code/useCommonCode";
import { useCommonCodeDelete } from "@/resources/code/useCommonCodeDelete";
import { useCommonCodeSave } from "@/resources/code/useCommonCodeSave";
import { useCommonCodeUpdate } from "@/resources/code/useCommonCodeUpdate";

interface CommonCodeDialogProps {
  open: boolean;
  groupCode: string;
  commonCodeValue?: string;
  readonly?: boolean;
  onClose: () => void;
}

export function CommonCodeDialog({
  open,
  groupCode,
  commonCodeValue,
  readonly = false,
  onClose,
}: CommonCodeDialogProps) {
  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { data: commonCode, isEnabled: isEditMode } = useCommonCode({
    groupCode,
    commonCode: commonCodeValue,
  });

  const { mutate: saveCommonCode } = useCommonCodeSave();
  const { mutate: updateCommonCode } = useCommonCodeUpdate({
    commonCode: commonCodeValue,
  });
  const { mutate: deleteCommonCode } = useCommonCodeDelete({
    commonCode: commonCodeValue,
  });

  const handleSubmit = (
    data: CommonCode,
    options: { onSuccess: () => void },
  ) => {
    if (isEditMode) {
      updateCommonCode(
        {
          groupCode: data.groupCode,
          commonCode: data.commonCode,
          commonCodeName: data.commonCodeName,
          commonCodeDescription: data.commonCodeDescription,
          dataStatus: data.dataStatus,
        },
        options,
      );
      return;
    }

    saveCommonCode(data, options);
  };

  const handleDelete = (options: { onSuccess: () => void }) => {
    deleteCommonCode(
      { groupCode, commonCode: commonCodeValue as string },
      options,
    );
  };

  return (
    <DetailFormModal<CommonCode>
      open={open}
      keyValue={commonCodeValue}
      labelKey={TRANSLATION_KEY.code.label.COMMON_CODE}
      formValue={commonCode ?? ({ groupCode } as CommonCode)}
      isEditMode={isEditMode}
      readonly={readonly}
      getTargetValue={(data) => data.commonCode}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onClose={onClose}
    >
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.code.label.GROUP_CODE)}
        required
      >
        <TextInputField<CommonCode, "groupCode">
          name="groupCode"
          label={translate(TRANSLATION_KEY.code.label.GROUP_CODE)}
          readonly
          required
          maxLength={50}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.code.label.COMMON_CODE)}
        required
      >
        <TextInputField<CommonCode, "commonCode">
          name="commonCode"
          label={translate(TRANSLATION_KEY.code.label.COMMON_CODE)}
          readonly={isEditMode || readonly}
          required
          maxLength={50}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.code.label.COMMON_CODE_NAME)}
        required
      >
        <TextInputField<CommonCode, "commonCodeName">
          name="commonCodeName"
          label={translate(TRANSLATION_KEY.code.label.COMMON_CODE_NAME)}
          required
          readonly={readonly}
          maxLength={100}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.DESCRIPTION)}
      >
        <TextareaField<CommonCode, "commonCodeDescription">
          name="commonCodeDescription"
          label={translate(TRANSLATION_KEY.common.label.DESCRIPTION)}
          readonly={readonly}
        />
      </DetailForm.Item>
      {!isEditMode && (
        <DetailForm.Item
          title={translate(TRANSLATION_KEY.common.label.SORT_ORDER)}
          required
        >
          <NumberInputField<CommonCode, "sortOrder">
            name="sortOrder"
            label={translate(TRANSLATION_KEY.common.label.SORT_ORDER)}
            required
            readonly={readonly}
            renderProps={{
              min: 1,
            }}
          />
        </DetailForm.Item>
      )}
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
        required
      >
        <SelectInputField<CommonCode, "dataStatus">
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
