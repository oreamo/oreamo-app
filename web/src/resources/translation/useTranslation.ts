import { PageInfo } from "@/models/common-model";
import { Translation } from "@/models/translation-model";
import { useFetch } from "@/resources/_hooks/useFetch";

interface UseTranslationOptions {
  translationGroup?: string;
  translationType?: string;
  translationCode?: string;
  translationLocale?: string;
}

export function useTranslation({
  translationGroup,
  translationType,
  translationCode,
  translationLocale,
}: UseTranslationOptions) {
  const { data, ...query } = useFetch<PageInfo<Translation>>({
    url: "/translations",
    params: {
      translationGroup,
      translationType,
      translationCode,
      translationLocale,
    },
    enabled:
      !!translationGroup &&
      !!translationType &&
      !!translationCode &&
      !!translationLocale,
  });

  return {
    ...query,
    data: data?.list[0],
  };
}
