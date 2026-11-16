import { MultiSelectInputField } from "@/components/data-form/components/MultiSelectInputField";
import { SearchForm } from "@/components/data-form/components/SearchForm";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { RoleSearch } from "@/models/authority-model";
import { usePermissionInfos } from "@/resources/authority/usePermissionInfos";

interface RoleSearchFormProps {
  onSearch: (roleSearchValue: Partial<RoleSearch>) => void;
  onRefresh?: () => void;
}

export function RoleSearchForm({ onSearch, onRefresh }: RoleSearchFormProps) {
  const { translate } = useTranslate();

  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);

  const { data: permissionInfos = [] } = usePermissionInfos();

  const { form, handleSubmit, handleEnter } = useDataForm<RoleSearch>({
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
        <TextInputField<RoleSearch, "roleName">
          name="roleName"
          label={translate(TRANSLATION_KEY.authority.label.ROLE_NAME)}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <MultiSelectInputField<RoleSearch, "permissionCodes">
          name="permissionCodes"
          label={translate(TRANSLATION_KEY.authority.label.PERMISSION)}
          options={permissionInfos.map((permissionInfo) => ({
            value: permissionInfo.permissionCode,
            label: permissionInfo.permissionName,
          }))}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <SelectInputField<RoleSearch, "dataStatus">
          name="dataStatus"
          label={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
          options={getOptions("DATA_STATUS")}
        />
      </SearchForm.Item>
    </SearchForm>
  );
}
