import { ReactNode } from "react";

import { FieldValues, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/common/button/Button";
import { IconButton } from "@/components/common/button/IconButton";
import { Card } from "@/components/common/display/Card";
import { DataForm } from "@/components/data-form/DataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";

export interface SearchFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  children?: ReactNode;
  onSearch?: () => void;
  onRefresh?: () => void;
  onEnter?: () => void;
}

export function SearchForm<TFieldValues extends FieldValues>({
  form,
  children,
  onSearch,
  onRefresh,
  onEnter,
}: SearchFormProps<TFieldValues>) {
  const { translate } = useTranslate();

  const handleRefresh = () => {
    onRefresh?.();
  };

  const handleSearch = () => {
    onSearch?.();
  };

  return (
    <Card>
      <DataForm form={form} onEnter={onEnter}>
        <DataForm.Row>
          {children}
          <SearchForm.Item action>
            <IconButton
              iconName="Refresh"
              variant="outlined"
              onClick={handleRefresh}
            />
            <Button type="button" variant="contained" onClick={handleSearch}>
              {translate(TRANSLATION_KEY.common.label.SEARCH)}
            </Button>
          </SearchForm.Item>
        </DataForm.Row>
      </DataForm>
    </Card>
  );
}

interface SearchFormItemProps {
  span?: boolean;
  action?: boolean;
  children?: ReactNode;
}

function SearchFormItem({
  span = false,
  action = false,
  children,
}: SearchFormItemProps) {
  return (
    <DataForm.Column span={span} action={action}>
      {children}
    </DataForm.Column>
  );
}

SearchForm.Item = SearchFormItem;
