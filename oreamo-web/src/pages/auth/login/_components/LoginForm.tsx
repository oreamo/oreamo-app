import { styled } from "@mui/material";

import coztionLogo from "@/assets/images/coztion.png";
import { Button } from "@/components/common/button/Button";
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

export function LoginForm() {
  const toast = useSystemToast();

  const { translate } = useTranslate();

  const { mutate: login } = useSessionUserLogin();

  const {
    form: loginForm,
    handleSubmit: handleLoginSubmit,
    handleEnter: handleLoginEnter,
  } = useDataForm<LoginInfo>({
    onValid: (data) => {
      login(data, {
        onSuccess: (_response, variables) => {
          toast({
            type: "info",
            message: translate(TRANSLATION_KEY.user.message.LOGIN_SUCCESS, {
              username: variables.username,
            }),
          });
        },
        onError: () => {
          toast({
            type: "error",
            message: translate(TRANSLATION_KEY.user.message.LOGIN_FAILURE, {
              username: data.username,
            }),
          });
        },
      });
    },
  });

  return (
    <StyledLoginFormContainer direction="column" gap={4}>
      <Flex justify="center">
        <Image src={coztionLogo} alt="Coztion" width={52} height={52} circle />
      </Flex>
      <Flex direction="column" gap={0.5}>
        <Text size="xl" weight="semibold">
          {translate(TRANSLATION_KEY.user.message.WELCOME_BACK)}
        </Text>
        <Text size="sm" color="secondary">
          {translate(TRANSLATION_KEY.user.message.SIGN_IN_DESCRIPTION)}
        </Text>
      </Flex>
      <DataForm form={loginForm} onEnter={handleLoginEnter}>
        <TextInputField<LoginInfo, "username">
          name="username"
          label={translate(TRANSLATION_KEY.user.label.USERNAME)}
          validation={{
            minLength: (value) => {
              return value && value.length < 5
                ? translate(
                    TRANSLATION_KEY.common.message.MIN_SIZE_VALIDATION_FAILURE,
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
                    TRANSLATION_KEY.common.message.MAX_SIZE_VALIDATION_FAILURE,
                    {
                      target: TRANSLATION_KEY.user.label.USERNAME,
                      maxValue: "50",
                    },
                  )
                : undefined;
            },
          }}
        />
        <TextInputField<LoginInfo, "password">
          name="password"
          label={translate(TRANSLATION_KEY.user.label.PASSWORD)}
          validation={{
            minLength: (value) => {
              return value && value.length < 8
                ? translate(
                    TRANSLATION_KEY.common.message.MIN_SIZE_VALIDATION_FAILURE,
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
        <Button
          type="button"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLoginSubmit}
        >
          {translate(TRANSLATION_KEY.user.label.SIGN_IN)}
        </Button>
      </DataForm>
    </StyledLoginFormContainer>
  );
}

const StyledLoginFormContainer = styled(Flex)(({ theme }) => ({
  width: 400,

  padding: theme.spacing(5),

  borderRadius: theme.shape.borderRadiusScale.lg,
  border: `1px solid ${theme.palette.scale[300]}`,

  backgroundColor: theme.palette.surface.raised,
}));
