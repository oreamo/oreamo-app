import { ChangeEvent } from "react";

import { Card } from "@/components/common/display/Card";
import { DebounceTextInput } from "@/components/common/input/DebounceTextInput";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import { useTranslate } from "@/hooks/useTranslate";
import { TranslationSearch } from "@/models/translation-model";
import { PageLayout } from "@/pages/_components/PageLayout";
import { TranslationGrid } from "@/pages/setting/system/translation-management/_components/TranslationGrid";
import { TranslationSearchForm } from "@/pages/setting/system/translation-management/_components/TranslationSearchForm";
import { useTranslations } from "@/resources/translation/useTranslations";

export function TranslationManagementPage() {
  const { translate } = useTranslate();

  const {
    searchValue: translationSearchValue,
    pagination: translationPagination,
    handleSearchValueChange: handleSearchValueChange,
    handlePageChange,
  } = useSearchPagination<TranslationSearch>();

  const { data: translationsPageInfo, fetch: fetchTranslations } =
    useTranslations({
      translationSearchValue,
      translationPagination,
    });

  const handleRefresh = () => {
    fetchTranslations();
  };

  const handleTranslationKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSearchValueChange({
      translationKey: event.target.value,
    });
  };

  return (
    <PageLayout>
      <TranslationSearchForm
        onSearch={handleSearchValueChange}
        onRefresh={handleRefresh}
      />
      <Card>
        <DebounceTextInput
          label={translate(TRANSLATION_KEY.translation.label.TRANSLATION_KEY)}
          onChange={handleTranslationKeyChange}
        />
      </Card>
      <TranslationGrid
        rowData={translationsPageInfo?.list}
        pageInfo={translationsPageInfo}
        onPaginationChange={handlePageChange}
      />
    </PageLayout>
  );
}
