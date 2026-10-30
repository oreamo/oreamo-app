import { TranslationDelete } from "@/models/translation-model";
import { useAction } from "@/resources/_hooks/useAction";

interface UseTranslationDeleteOptions {
  translationCode?: string;
}

export function useTranslationDelete({
  translationCode,
}: UseTranslationDeleteOptions) {
  return useAction<TranslationDelete, boolean>({
    url: `/translations/${translationCode}`,
    method: "delete",
    invalidateUrls: ["/translations"],
  });
}
