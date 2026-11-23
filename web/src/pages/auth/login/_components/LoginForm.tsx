import { useState } from "react";

import oreamoLogo from "@/assets/images/oreamo.png";
import { Button } from "@/components/common/button/Button";
import { Callout } from "@/components/common/display/Callout";
import { Image } from "@/components/common/display/Image";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { DataForm } from "@/components/data-form/DataForm";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { LoginInfo } from "@/models/user-model";
import { useSessionUserLogin } from "@/resources/user/useSessionUserLogin";
import { useSystemToast } from "@/stores/system-toast-store";

interface LoginFormProps {
  onPasswordChangeRequire: (username: string) => void;
}

export function LoginForm({ onPasswordChangeRequire }: LoginFormProps) {
  const toast = useSystemToast();

  const { translate } = useTranslate();

  const [loginFailureMessage, setLoginFailureMessage] = useState<string>();

  const { mutate: login } = useSessionUserLogin();

  const {
    form: loginForm,
    handleSubmit: handleLoginSubmit,
    handleEnter: handleLoginEnter,
  } = useDataForm<LoginInfo>({
    onValid: (data) => {
      setLoginFailureMessage(undefined);

      login(data, {
        onSuccess: (response, variables) => {
          if (!response.data.succeed) return;

          if (response.data.data.passwordChangeRequired) {
            loginForm.reset({ username: variables.username, password: "" });
            onPasswordChangeRequire(variables.username);
            return;
          }

          toast({
            type: "info",
            message: translate(TRANSLATION_KEY.user.message.LOGIN_SUCCESS, {
              username: variables.username,
            }),
          });
        },
        onError: () => {
          setLoginFailureMessage(
            translate(TRANSLATION_KEY.user.message.LOGIN_FAILURE),
          );
        },
      });
    },
  });

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="center">
        <Image src={oreamoLogo} alt="Oreamo" width={52} height={52} circle />
      </Flex>
      <Flex direction="column" gap={0.5}>
        <Text size="xl" weight="semibold">
          {translate(TRANSLATION_KEY.user.message.WELCOME_BACK)}
        </Text>
        <Text size="sm" color="secondary">
          {translate(TRANSLATION_KEY.user.message.SIGN_IN_DESCRIPTION)}
        </Text>
      </Flex>
      {loginFailureMessage && (
        <Callout type="error">{loginFailureMessage}</Callout>
      )}
      <DataForm form={loginForm} onEnter={handleLoginEnter}>
        <DataForm.Row>
          <DataForm.Column span>
            <TextInputField<LoginInfo, "username">
              name="username"
              label={translate(TRANSLATION_KEY.user.label.USERNAME)}
              validation={{
                minLength: (value) => {
                  return value && value.length < 5
                    ? translate(
                        TRANSLATION_KEY.common.message
                          .MIN_SIZE_VALIDATION_FAILURE,
                        {
                          target: TRANSLATION_KEY.user.label.USERNAME,
                          minValue: "6",
                        },
                      )
                    : undefined;
                },
                maxLength: (value) => {
                  return value && value.length > 50
                    ? translate(
                        TRANSLATION_KEY.common.message
                          .MAX_SIZE_VALIDATION_FAILURE,
                        {
                          target: TRANSLATION_KEY.user.label.USERNAME,
                          maxValue: "50",
                        },
                      )
                    : undefined;
                },
              }}
            />
          </DataForm.Column>
          <DataForm.Column span>
            <TextInputField<LoginInfo, "password">
              name="password"
              label={translate(TRANSLATION_KEY.user.label.PASSWORD)}
              validation={{
                minLength: (value) => {
                  return value && value.length < 8
                    ? translate(
                        TRANSLATION_KEY.common.message
                          .MIN_SIZE_VALIDATION_FAILURE,
                        {
                          target: TRANSLATION_KEY.user.label.PASSWORD,
                          minValue: "8",
                        },
                      )
                    : undefined;
                },
              }}
              renderProps={{
                type: "password",
              }}
            />
          </DataForm.Column>
          <DataForm.Column span>
            <Button
              type="button"
              variant="contained"
              size="large"
              fullWidth
              onClick={handleLoginSubmit}
            >
              {translate(TRANSLATION_KEY.user.label.SIGN_IN)}
            </Button>
          </DataForm.Column>
        </DataForm.Row>
      </DataForm>
    </Flex>
  );
}
