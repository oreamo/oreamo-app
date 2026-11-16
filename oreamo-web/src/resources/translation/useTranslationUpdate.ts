import { Translation, TranslationUpdate } from "@/models/translation-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseTranslationUpdateOptions {
  translationCode?: string;
}

export function useTranslationUpdate({
  translationCode,
}: UseTranslationUpdateOptions) {
  return useAction<TranslationUpdate, Translation>({
    url: `/translations/${translationCode}`,
    method: "put",
    invalidateUrls: ["/translations"],
  });
}
