import { useState } from "react";

import { Button } from "@/components/common/button/Button";
import { Card } from "@/components/common/display/Card";
import { Flex } from "@/components/common/layout/Flex";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { DataForm } from "@/components/data-form/DataForm";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { UserInfo, UserSessionUpdate } from "@/models/user-model";
import { PasswordChangeModal } from "@/pages/setting/user/profile/_components/PasswordChangeModal";
import { useUserSessionUpdate } from "@/resources/user/useUserSessionUpdate";
import { useSystemConfirm } from "@/stores/system-dialog-store";
import { useSystemToast } from "@/stores/system-toast-store";

interface ProfileFormProps {
  userInfo: UserInfo;
}

export function ProfileForm({ userInfo }: ProfileFormProps) {
  const confirm = useSystemConfirm();
  const toast = useSystemToast();

  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);

  const { translate } = useTranslate();

  const { mutate: updateProfile } = useUserSessionUpdate();

  const { form, handleSubmit, handleEnter } = useDataForm<UserSessionUpdate>({
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

  const handlePasswordChangeClick = () => {
    setPasswordChangeOpen(true);
  };

  const handlePasswordChangeClose = () => {
    setPasswordChangeOpen(false);
  };

  return (
    <Card>
      <DataForm form={form} onEnter={handleEnter}>
        <TextInputField<UserSessionUpdate, "name">
          name="name"
          label={translate(TRANSLATION_KEY.user.label.NAME)}
          required
          maxLength={100}
        />
        <TextInputField<UserSessionUpdate, "email">
          name="email"
          label={translate(TRANSLATION_KEY.user.label.EMAIL)}
          required
          maxLength={100}
        />
        <Flex justify="end" gap={2}>
          <Button
            type="button"
            variant="outlined"
            onClick={handlePasswordChangeClick}
          >
            {translate(TRANSLATION_KEY.user.label.CHANGE_PASSWORD)}
          </Button>
          <Button type="button" variant="contained" onClick={handleSubmit}>
            {translate(TRANSLATION_KEY.common.label.SAVE)}
          </Button>
        </Flex>
      </DataForm>
      <PasswordChangeModal
        open={passwordChangeOpen}
        onClose={handlePasswordChangeClose}
      />
    </Card>
  );
}
