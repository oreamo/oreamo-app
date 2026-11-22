import { Pagination, PageInfo } from "@/models/common-model";
import { Translation, TranslationSearch } from "@/models/translation-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseTranslationsOptions {
  translationSearchValue: TranslationSearch;
  translationPagination: Pagination;
}

export function useTranslations({
  translationSearchValue,
  translationPagination,
}: UseTranslationsOptions) {
  return useFetch<PageInfo<Translation>>({
    url: "/translations",
    params: {
      ...translationSearchValue,
      ...translationPagination,
    },
  });
}
