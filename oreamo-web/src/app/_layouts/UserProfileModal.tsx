import { useWatch } from "react-hook-form";

import { UserAvatar } from "@/app/_layouts/UserAvatar";
import { TextInput } from "@/components/common/input/TextInput";
import { Flex } from "@/components/common/layout/Flex";
import { Modal } from "@/components/common/overlay/Modal";
import { DetailForm } from "@/components/data-form/components/DetailForm";
import { FileInputField } from "@/components/data-form/components/FileInputField";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { UserInfo } from "@/models/user-model";
import { useFileGroup } from "@/resources/file/useFileGroup";
import { useSessionProfileImageDelete } from "@/resources/user/useSessionProfileImageDelete";
import { useSessionProfileImageUpdate } from "@/resources/user/useSessionProfileImageUpdate";
import { useSystemToast } from "@/stores/system-toast-store";

const PROFILE_IMAGE_ACCEPT = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
};

interface UserProfileFormValues {
  profileImageFileGroupId?: string;
}

interface UserProfileModalProps {
  open: boolean;
  userInfo: UserInfo;
  onClose: () => void;
}

export function UserProfileModal({
  open,
  userInfo,
  onClose,
}: UserProfileModalProps) {
  const toast = useSystemToast();

  const { translate } = useTranslate();

  const { mutate: updateProfileImage } = useSessionProfileImageUpdate();
  const { mutate: deleteProfileImage } = useSessionProfileImageDelete();

  const { form, handleSubmit, handleEnter } =
    useDataForm<UserProfileFormValues>({
      values: { profileImageFileGroupId: userInfo.profileImageFileGroupId },
      onValid: (data) => {
        if (data.profileImageFileGroupId) {
          updateProfileImage(
            { fileGroupId: data.profileImageFileGroupId },
            {
              onSuccess: () => {
                toast({
                  type: "success",
                  message: translate(
                    TRANSLATION_KEY.user.message.PROFILE_IMAGE_CHANGE_SUCCESS,
                  ),
                });
                onClose();
              },
            },
          );
          return;
        }

        if (userInfo.profileImageFileGroupId) {
          deleteProfileImage(undefined, {
            onSuccess: () => {
              toast({
                type: "success",
                message: translate(
                  TRANSLATION_KEY.user.message.PROFILE_IMAGE_REMOVE_SUCCESS,
                ),
              });
              onClose();
            },
          });
          return;
        }

        onClose();
      },
    });

  const profileImageFileGroupId = useWatch({
    control: form.control,
    name: "profileImageFileGroupId",
  });

  const { data: profileImageFileGroup } = useFileGroup({
    fileGroupId: profileImageFileGroupId,
  });

  const handleClose = () => {
    onClose();
  };

  const previewFileId = profileImageFileGroupId
    ? profileImageFileGroup?.files.at(-1)?.fileId
    : undefined;

  return (
    <Modal
      open={open}
      title={translate(TRANSLATION_KEY.user.label.EDIT_PROFILE)}
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
      <Flex direction="column" gap={4}>
        <Flex justify="center">
          <UserAvatar
            username={userInfo.username}
            imageFileId={previewFileId}
            size="large"
          />
        </Flex>
        <DetailForm form={form} onEnter={handleEnter}>
          <DetailForm.Item
            title={translate(TRANSLATION_KEY.user.label.USERNAME)}
          >
            <TextInput value={userInfo.username} readonly />
          </DetailForm.Item>
          <DetailForm.Item
            title={translate(TRANSLATION_KEY.authority.label.ROLE)}
          >
            <TextInput value={userInfo.roleCode} readonly />
          </DetailForm.Item>
          <DetailForm.Item
            title={translate(TRANSLATION_KEY.user.label.PROFILE_IMAGE)}
          >
            <FileInputField<UserProfileFormValues, "profileImageFileGroupId">
              name="profileImageFileGroupId"
              label={translate(TRANSLATION_KEY.user.label.PROFILE_IMAGE)}
              renderProps={{ accept: PROFILE_IMAGE_ACCEPT, multiple: false }}
            />
          </DetailForm.Item>
        </DetailForm>
      </Flex>
    </Modal>
  );
}
