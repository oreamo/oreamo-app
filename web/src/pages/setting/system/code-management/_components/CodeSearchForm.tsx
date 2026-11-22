import { SearchForm } from "@/components/data-form/components/SearchForm";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { GroupCodeSearch } from "@/models/code-model";

interface CodeSearchFormProps {
  onSearch: (groupCodeSearchValue: GroupCodeSearch) => void;
  onRefresh?: () => void;
}

export function CodeSearchForm({ onSearch, onRefresh }: CodeSearchFormProps) {
  const { translate } = useTranslate();

  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);

  const { form, handleSubmit, handleEnter } = useDataForm<GroupCodeSearch>({
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
        <TextInputField<GroupCodeSearch, "groupCodeName">
          name="groupCodeName"
          label={translate(TRANSLATION_KEY.code.label.GROUP_CODE_NAME)}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <TextInputField<GroupCodeSearch, "commonCodeName">
          name="commonCodeName"
          label={translate(TRANSLATION_KEY.code.label.COMMON_CODE_NAME)}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <SelectInputField<GroupCodeSearch, "dataStatus">
          name="dataStatus"
          label={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
          options={getOptions("DATA_STATUS")}
        />
      </SearchForm.Item>
    </SearchForm>
  );
}
