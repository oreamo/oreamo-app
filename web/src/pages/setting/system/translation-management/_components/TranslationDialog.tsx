import { DetailForm } from "@/components/data-form/components/DetailForm";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextareaField } from "@/components/data-form/components/TextareaField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { Translation } from "@/models/translation-model";
import { DetailFormModal } from "@/pages/setting/system/_components/DetailFormModal";
import { useTranslation } from "@/resources/translation/useTranslation";
import { useTranslationDelete } from "@/resources/translation/useTranslationDelete";
import { useTranslationSave } from "@/resources/translation/useTranslationSave";
import { useTranslationUpdate } from "@/resources/translation/useTranslationUpdate";

interface TranslationDialogProps {
  open: boolean;
  translationGroup?: string;
  translationType?: string;
  translationCode?: string;
  translationLocale?: string;
  readonly?: boolean;
  onClose: () => void;
}

export function TranslationDialog({
  open,
  translationGroup,
  translationType,
  translationCode,
  translationLocale,
  readonly = false,
  onClose,
}: TranslationDialogProps) {
  const { getCodeOptions: getOptions } = useCodeOptions([
    "DATA_STATUS",
    "TRANSLATION_GROUP",
    "TRANSLATION_TYPE",
    "TRANSLATION_LOCALE",
  ]);
  const { translate } = useTranslate();

  const { data: translation, isEnabled: isEditMode } = useTranslation({
    translationGroup,
    translationType,
    translationCode,
    translationLocale,
  });

  const { mutate: saveTranslation } = useTranslationSave();
  const { mutate: updateTranslation } = useTranslationUpdate({
    translationCode,
  });
  const { mutate: deleteTranslation } = useTranslationDelete({
    translationCode,
  });

  const handleSubmit = (
    data: Translation,
    options: { onSuccess: () => void },
  ) => {
    if (isEditMode) {
      updateTranslation(
        {
          translationGroup: data.translationGroup,
          translationType: data.translationType,
          translationCode: data.translationCode,
          translationLocale: data.translationLocale,
          translationContent: data.translationContent,
          dataStatus: data.dataStatus,
        },
        options,
      );
      return;
    }

    saveTranslation(data, options);
  };

  const handleDelete = (options: { onSuccess: () => void }) => {
    deleteTranslation(
      {
        translationGroup: translationGroup as string,
        translationType: translationType as string,
        translationCode: translationCode as string,
        translationLocale: translationLocale as string,
      },
      options,
    );
  };

  return (
    <DetailFormModal<Translation>
      open={open}
      keyValue={translationCode}
      labelKey={TRANSLATION_KEY.translation.label.TRANSLATION}
      formValue={
        translation ??
        ({
          translationGroup,
          translationType,
          translationCode,
          translationLocale,
        } as Translation)
      }
      isEditMode={isEditMode}
      readonly={readonly}
      getTargetValue={(data) => data.translationCode}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onClose={onClose}
    >
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.translation.label.TRANSLATION_GROUP)}
        required
      >
        <SelectInputField<Translation, "translationGroup">
          name="translationGroup"
          label={translate(TRANSLATION_KEY.translation.label.TRANSLATION_GROUP)}
          required
          readonly={isEditMode || readonly}
          options={getOptions("TRANSLATION_GROUP")}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.translation.label.TRANSLATION_TYPE)}
        required
      >
        <SelectInputField<Translation, "translationType">
          name="translationType"
          label={translate(TRANSLATION_KEY.translation.label.TRANSLATION_TYPE)}
          required
          readonly={isEditMode || readonly}
          options={getOptions("TRANSLATION_TYPE")}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.translation.label.TRANSLATION_CODE)}
        required
      >
        <TextInputField<Translation, "translationCode">
          name="translationCode"
          label={translate(TRANSLATION_KEY.translation.label.TRANSLATION_CODE)}
          readonly={isEditMode || readonly}
          required
          maxLength={100}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.translation.label.TRANSLATION_LOCALE)}
        required
      >
        <SelectInputField<Translation, "translationLocale">
          name="translationLocale"
          label={translate(
            TRANSLATION_KEY.translation.label.TRANSLATION_LOCALE,
          )}
          required
          readonly={isEditMode || readonly}
          options={getOptions("TRANSLATION_LOCALE")}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.translation.label.TRANSLATION_CONTENT)}
        required
      >
        <TextareaField<Translation, "translationContent">
          name="translationContent"
          label={translate(
            TRANSLATION_KEY.translation.label.TRANSLATION_CONTENT,
          )}
          required
          readonly={readonly}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
        required
      >
        <SelectInputField<Translation, "dataStatus">
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
