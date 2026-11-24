import { IconButton } from "@/components/common/button/IconButton";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";

export function MenuIconGuideButton() {
  const { translate } = useTranslate();

  const handleIconGuideOpen = () => {
    window.open(
      "https://mui.com/material-ui/material-icons/",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <IconButton
      iconName="OpenInNew"
      size="small"
      tooltip={{
        message: translate(TRANSLATION_KEY.menu.message.ICON_NAME_GUIDE),
        placement: "top",
      }}
      onClick={handleIconGuideOpen}
    />
  );
}
