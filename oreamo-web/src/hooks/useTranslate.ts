import { useTranslationInfos } from "@/resources/translation/useTranslationInfos";

export function useTranslate() {
  const { data: translationInfos } = useTranslationInfos();

  const translationSource = (translationInfos ?? []).reduce<
    Record<string, string>
  >((source, translateInfo) => {
    source[translateInfo.translationKey] = translateInfo.translationContent;
    return source;
  }, {});

  const translate = (
    translationKey: string,
    translationVariableKeys?: Record<string, string>,
  ): string => {
    const emptyTranslationVariableKeys = !translationVariableKeys;
    if (emptyTranslationVariableKeys) {
      return translationSource[translationKey] ?? translationKey;
    }

    const translatedMessage =
      translationSource[translationKey] ?? translationKey;

    return Object.entries(translationVariableKeys).reduce(
      (message, [variableName, variableKey]) => {
        return message.replaceAll(
          `{{${variableName}}}`,
          translate(variableKey),
        );
      },
      translatedMessage,
    );
  };

  const translateSequential = (
    translationKey: string,
    ...additionalTranslationKeys: string[]
  ): string => {
    const translatedMessage =
      translationSource[translationKey] ?? translationKey;

    if (additionalTranslationKeys.length === 0) {
      return translatedMessage;
    }

    const translatedValues = additionalTranslationKeys.map(
      (additionalTranslationKey) => {
        return translate(additionalTranslationKey);
      },
    );

    let index = 0;
    return translatedMessage.replace(/\{\{[^}]*\}\}/g, () => {
      const value = translatedValues[index] ?? "";
      index += 1;
      return value;
    });
  };

  return {
    translate,
    translateSequential,
  };
}
