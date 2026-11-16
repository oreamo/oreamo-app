import { SearchForm } from "@/components/data-form/components/SearchForm";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { TranslationSearch } from "@/models/translation-model";

interface TranslationSearchFormProps {
  onSearch: (translationSearchValue: TranslationSearch) => void;
  onRefresh?: () => void;
}

export function TranslationSearchForm({
  onSearch,
  onRefresh,
}: TranslationSearchFormProps) {
  const { translate } = useTranslate();

  const { getCodeOptions: getOptions } = useCodeOptions([
    "DATA_STATUS",
    "TRANSLATION_GROUP",
    "TRANSLATION_TYPE",
    "TRANSLATION_LOCALE",
  ]);

  const { form, handleSubmit, handleEnter } = useDataForm<TranslationSearch>({
    onValid: (data) => {
      onSearch(data);
    },
  });

  return (
    <SearchForm
      form={form}
      onSearch={handleSubmit}
      onRefresh={onRefresh}
      onEnter={handleEnter}
    >
      <SearchForm.Item>
        <SelectInputField<TranslationSearch, "translationGroup">
          name="translationGroup"
          label={translate(TRANSLATION_KEY.translation.label.TRANSLATION_GROUP)}
          options={getOptions("TRANSLATION_GROUP")}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <SelectInputField<TranslationSearch, "translationType">
          name="translationType"
          label={translate(TRANSLATION_KEY.translation.label.TRANSLATION_TYPE)}
          options={getOptions("TRANSLATION_TYPE")}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <TextInputField<TranslationSearch, "translationCode">
          name="translationCode"
          label={translate(TRANSLATION_KEY.translation.label.TRANSLATION_CODE)}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <SelectInputField<TranslationSearch, "translationLocale">
          name="translationLocale"
          label={translate(
            TRANSLATION_KEY.translation.label.TRANSLATION_LOCALE,
          )}
          options={getOptions("TRANSLATION_LOCALE")}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <SelectInputField<TranslationSearch, "dataStatus">
          name="dataStatus"
          label={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
          options={getOptions("DATA_STATUS")}
        />
      </SearchForm.Item>
    </SearchForm>
  );
}
