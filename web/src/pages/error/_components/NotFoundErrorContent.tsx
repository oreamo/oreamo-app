import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { ErrorContent } from "@/pages/error/_components/ErrorContent";

export function NotFoundErrorContent() {
  const { translate } = useTranslate();

  return (
    <ErrorContent
      iconName="SearchOff"
      code="404"
      title={translate(
        TRANSLATION_KEY.common.message.NOT_FOUND_ERROR_CONTENT_TITLE,
      )}
      description={translate(
        TRANSLATION_KEY.common.message.NOT_FOUND_ERROR_CONTENT_DESCRIPTION,
      )}
    />
  );
}
