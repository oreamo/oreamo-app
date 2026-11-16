import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { ErrorContent } from "@/pages/error/_components/ErrorContent";

export function ServerErrorContent() {
  const { translate } = useTranslate();

  return (
    <ErrorContent
      iconName="ReportProblem"
      code="500"
      title={translate(
        TRANSLATION_KEY.common.message.SERVER_ERROR_ERROR_CONTENT_TITLE,
      )}
      description={translate(
        TRANSLATION_KEY.common.message.SERVER_ERROR_ERROR_CONTENT_DESCRIPTION,
      )}
    />
  );
}
