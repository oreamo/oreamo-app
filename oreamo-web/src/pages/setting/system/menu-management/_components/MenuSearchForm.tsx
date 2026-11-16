import { SearchForm } from "@/components/data-form/components/SearchForm";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { MenuSearch } from "@/models/menu-model";

interface MenuSearchFormProps {
  onSearch: (menuSearchValue: MenuSearch) => void;
  onRefresh?: () => void;
}

export function MenuSearchForm({ onSearch, onRefresh }: MenuSearchFormProps) {
  const { translate } = useTranslate();

  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);

  const { form, handleSubmit, handleEnter } = useDataForm<MenuSearch>({
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
        <TextInputField<MenuSearch, "menuName">
          name="menuName"
          label={translate(TRANSLATION_KEY.menu.label.MENU_NAME)}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <SelectInputField<MenuSearch, "dataStatus">
          name="dataStatus"
          label={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
          options={getOptions("DATA_STATUS")}
        />
      </SearchForm.Item>
    </SearchForm>
  );
}
