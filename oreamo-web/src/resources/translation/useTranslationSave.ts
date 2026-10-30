import { Translation, TranslationSave } from "@/models/translation-model";
import { useAction } from "@/resources/_hooks/useAction";

export function useTranslationSave() {
  return useAction<TranslationSave, Translation>({
    url: "/translations",
    method: "post",
  });
}
