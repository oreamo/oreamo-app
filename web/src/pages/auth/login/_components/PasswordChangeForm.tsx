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
import { PASSWORD_RULE_PATTERN } from "@/constants/user-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { UserPasswordChangeForm } from "@/pages/auth/login/_models/login-model";
import { useSessionPasswordChange } from "@/resources/user/useSessionPasswordChange";
import { useSystemToast } from "@/stores/system-toast-store";

interface PasswordChangeFormProps {
  username?: string;
  onClose: () => void;
}

export function PasswordChangeForm({
  username,
  onClose,
}: PasswordChangeFormProps) {
  const toast = useSystemToast();

  const { translate } = useTranslate();

  const [passwordChangeFailureMessage, setPasswordChangeFailureMessage] =
    useState<string>();

  const { mutate: changePassword } = useSessionPasswordChange();

  const { form, handleSubmit, handleEnter } =
    useDataForm<UserPasswordChangeForm>({
      onValid: (data) => {
        setPasswordChangeFailureMessage(undefined);

        changePassword(
          {
            username: username as string,
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
          {
            onSuccess: () => {
              toast({
                type: "success",
                message: translate(
                  TRANSLATION_KEY.user.message.PASSWORD_CHANGE_SUCCESS,
                ),
              });
              form.reset();
              onClose();
            },
            onFailure: (failureMessage) => {
              setPasswordChangeFailureMessage(failureMessage);
            },
          },
        );
      },
    });

  const handleCancelClick = () => {
    setPasswordChangeFailureMessage(undefined);
    form.reset();
    onClose();
  };

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="center">
        <Image src={oreamoLogo} alt="Oreamo" width={52} height={52} circle />
      </Flex>
      <Flex direction="column" gap={0.5}>
        <Text size="xl" weight="semibold">
          {translate(TRANSLATION_KEY.user.label.CHANGE_PASSWORD)}
        </Text>
        <Text size="sm" color="secondary">
          {translate(TRANSLATION_KEY.user.message.PASSWORD_CHANGE_REQUIRED)}
        </Text>
      </Flex>
      {passwordChangeFailureMessage && (
        <Callout type="error">{passwordChangeFailureMessage}</Callout>
      )}
      <DataForm form={form} onEnter={handleEnter}>
        <DataForm.Row>
          <DataForm.Column span>
            <TextInputField<UserPasswordChangeForm, "currentPassword">
              name="currentPassword"
              label={translate(TRANSLATION_KEY.user.label.CURRENT_PASSWORD)}
              required
              renderProps={{
                type: "password",
              }}
            />
          </DataForm.Column>
          <DataForm.Column span>
            <TextInputField<UserPasswordChangeForm, "newPassword">
              name="newPassword"
              label={translate(TRANSLATION_KEY.user.label.NEW_PASSWORD)}
              required
              validation={{
                rule: (value) => {
                  return value && !PASSWORD_RULE_PATTERN.test(value)
                    ? translate(
                        TRANSLATION_KEY.user.message
                          .PASSWORD_RULE_VALIDATION_FAILURE,
                      )
                    : undefined;
                },
                reuse: (value, formValues) => {
                  return value && value === formValues.currentPassword
                    ? translate(
                        TRANSLATION_KEY.user.message.PASSWORD_REUSE_FAILURE,
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
            <TextInputField<UserPasswordChangeForm, "confirmPassword">
              name="confirmPassword"
              label={translate(TRANSLATION_KEY.user.label.CONFIRM_PASSWORD)}
              required
              validation={{
                confirm: (value, formValues) => {
                  return value && value !== formValues.newPassword
                    ? translate(
                        TRANSLATION_KEY.user.message.PASSWORD_CONFIRM_FAILURE,
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
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleCancelClick}
            >
              {translate(TRANSLATION_KEY.common.label.CANCEL)}
            </Button>
            <Button
              type="button"
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
            >
              {translate(TRANSLATION_KEY.common.label.SAVE)}
            </Button>
          </DataForm.Column>
        </DataForm.Row>
      </DataForm>
    </Flex>
  );
}
