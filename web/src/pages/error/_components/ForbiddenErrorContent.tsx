import { Button } from "@/components/common/button/Button";
import { ROUTE } from "@/constants/route-constant";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useNavigator } from "@/hooks/useNavigator";
import { useTranslate } from "@/hooks/useTranslate";
import { ErrorContent } from "@/pages/error/_components/ErrorContent";
import { useSessionUserLogout } from "@/resources/user/useSessionUserLogout";
import { useSystemToast } from "@/stores/system-toast-store";

export function ForbiddenErrorContent() {
  const { navigate } = useNavigator();
  const toast = useSystemToast();

  const { translate } = useTranslate();

  const { mutate: logout } = useSessionUserLogout();

  const handleLogoutClick = () => {
    logout(undefined, {
      onSuccess: () => {
        toast({
          type: "info",
          message: translate(TRANSLATION_KEY.user.message.LOGOUT_SUCCESS),
        });
        navigate(ROUTE.AUTH.LOGIN.URL);
      },
    });
  };

  return (
    <ErrorContent
      iconName="Lock"
      code="403"
      title={translate(
        TRANSLATION_KEY.common.message.FORBIDDEN_ERROR_CONTENT_TITLE,
      )}
      description={translate(
        TRANSLATION_KEY.common.message.FORBIDDEN_ERROR_CONTENT_DESCRIPTION,
      )}
      actions={
        <Button variant="contained" onClick={handleLogoutClick}>
          {translate(TRANSLATION_KEY.user.label.SIGN_OUT)}
        </Button>
      }
    />
  );
}
