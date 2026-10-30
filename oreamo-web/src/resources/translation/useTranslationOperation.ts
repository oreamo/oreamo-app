import { TranslationOperate } from "@/models/translation-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useTranslationOperation() {
  return useAction<TranslationOperate, boolean>({
    url: "/translations/operation",
    invalidateUrls: ["/translations"],
  });
}
