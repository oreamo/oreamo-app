import { SearchForm } from "@/components/data-form/components/SearchForm";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { UserSearch } from "@/models/user-model";
import { useRoleInfos } from "@/resources/authority/useRoleInfos";

interface UserSearchFormProps {
  onSearch: (userSearchValue: Partial<UserSearch>) => void;
  onRefresh?: () => void;
}

export function UserSearchForm({ onSearch, onRefresh }: UserSearchFormProps) {
  const { translate } = useTranslate();

  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);

  const { data: roleInfos = [] } = useRoleInfos();

  const { form, handleSubmit, handleEnter } = useDataForm<UserSearch>({
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
        <TextInputField<UserSearch, "username">
          name="username"
          label={translate(TRANSLATION_KEY.user.label.USERNAME)}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <SelectInputField<UserSearch, "roleCode">
          name="roleCode"
          label={translate(TRANSLATION_KEY.authority.label.ROLE)}
          options={roleInfos.map((roleInfo) => ({
            value: roleInfo.roleCode,
            label: roleInfo.roleName,
          }))}
        />
      </SearchForm.Item>
      <SearchForm.Item>
        <SelectInputField<UserSearch, "dataStatus">
          name="dataStatus"
          label={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
          options={getOptions("DATA_STATUS")}
        />
      </SearchForm.Item>
    </SearchForm>
  );
}
