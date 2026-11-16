import { Button } from "@/components/common/button/Button";
import { Card } from "@/components/common/display/Card";
import { Flex } from "@/components/common/layout/Flex";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { DataForm } from "@/components/data-form/DataForm";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { UserInfo } from "@/models/user-model";
import { useUserSessionPasswordReset } from "@/resources/user/useUserSessionPasswordReset";
import { useUserSessionUpdate } from "@/resources/user/useUserSessionUpdate";
import { useSystemConfirm } from "@/stores/system-dialog-store";
import { useSystemToast } from "@/stores/system-toast-store";

interface ProfileFormValues {
  name: string;
  email: string;
}

interface ProfileFormProps {
  userInfo: UserInfo;
}

export function ProfileForm({ userInfo }: ProfileFormProps) {
  const confirm = useSystemConfirm();
  const toast = useSystemToast();

  const { translate } = useTranslate();

  const { mutate: updateProfile } = useUserSessionUpdate();
  const { mutate: resetPassword } = useUserSessionPasswordReset();

  const { form, handleSubmit, handleEnter } = useDataForm<ProfileFormValues>({
    values: {
      name: userInfo.name,
      email: userInfo.email,
    },
    onValid: (data) => {
      confirm({
        content: translate(TRANSLATION_KEY.user.message.PROFILE_CHANGE_CONFIRM),
        onConfirm: () => {
          updateProfile(
            { name: data.name, email: data.email },
            {
              onSuccess: () => {
                toast({
                  type: "success",
                  message: translate(
                    TRANSLATION_KEY.user.message.PROFILE_CHANGE_SUCCESS,
                  ),
                });
              },
            },
          );
        },
      });
    },
  });

  const handlePasswordResetClick = () => {
    confirm({
      content: translate(TRANSLATION_KEY.user.message.PASSWORD_RESET_CONFIRM),
      onConfirm: () => {
        resetPassword(undefined, {
          onSuccess: () => {
            toast({
              type: "success",
              message: translate(
                TRANSLATION_KEY.user.message.PASSWORD_RESET_SUCCESS,
              ),
            });
          },
        });
      },
    });
  };

  return (
    <Card>
      <DataForm form={form} onEnter={handleEnter}>
        <TextInputField<ProfileFormValues, "name">
          name="name"
          label={translate(TRANSLATION_KEY.user.label.NAME)}
          required
          maxLength={100}
        />
        <TextInputField<ProfileFormValues, "email">
          name="email"
          label={translate(TRANSLATION_KEY.user.label.EMAIL)}
          required
          maxLength={100}
        />
        <Flex justify="end" gap={2}>
          <Button
            type="button"
            variant="outlined"
            onClick={handlePasswordResetClick}
          >
            {translate(TRANSLATION_KEY.common.label.RESET)}{" "}
            {translate(TRANSLATION_KEY.user.label.PASSWORD)}
          </Button>
          <Button type="button" variant="contained" onClick={handleSubmit}>
            {translate(TRANSLATION_KEY.common.label.SAVE)}
          </Button>
        </Flex>
      </DataForm>
    </Card>
  );
}
