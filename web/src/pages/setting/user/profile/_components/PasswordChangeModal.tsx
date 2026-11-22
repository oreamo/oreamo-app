import { Modal } from "@/components/common/overlay/Modal";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { DataForm } from "@/components/data-form/DataForm";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { PASSWORD_RULE_PATTERN } from "@/constants/user-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { UserSessionPasswordChangeForm } from "@/pages/setting/user/profile/_models/profile-model";
import { useUserSessionPasswordChange } from "@/resources/user/useUserSessionPasswordChange";
import { useSystemToast } from "@/stores/system-toast-store";

interface PasswordChangeModalProps {
  open: boolean;
  onClose: () => void;
}

export function PasswordChangeModal({
  open,
  onClose,
}: PasswordChangeModalProps) {
  const toast = useSystemToast();

  const { translate } = useTranslate();

  const { mutate: changePassword } = useUserSessionPasswordChange();

  const { form, handleSubmit, handleEnter } =
    useDataForm<UserSessionPasswordChangeForm>({
      onValid: (data) => {
        changePassword(
          {
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
          },
        );
      },
    });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={translate(TRANSLATION_KEY.user.label.CHANGE_PASSWORD)}
      size="small"
      actions={[
        {
          variant: "outlined",
          label: translate(TRANSLATION_KEY.common.label.CANCEL),
          onClick: handleClose,
        },
        {
          variant: "contained",
          label: translate(TRANSLATION_KEY.common.label.SAVE),
          onClick: handleSubmit,
        },
      ]}
      onClose={handleClose}
    >
      <DataForm form={form} onEnter={handleEnter}>
        <DataForm.Row>
          <DataForm.Column span>
            <TextInputField<UserSessionPasswordChangeForm, "currentPassword">
              name="currentPassword"
              label={translate(TRANSLATION_KEY.user.label.CURRENT_PASSWORD)}
              required
              renderProps={{
                type: "password",
              }}
            />
          </DataForm.Column>
          <DataForm.Column span>
            <TextInputField<UserSessionPasswordChangeForm, "newPassword">
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
            <TextInputField<UserSessionPasswordChangeForm, "confirmPassword">
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
        </DataForm.Row>
      </DataForm>
    </Modal>
  );
}
