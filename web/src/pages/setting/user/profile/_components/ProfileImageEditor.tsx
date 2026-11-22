import { ChangeEvent, MouseEvent, useRef, useState } from "react";

import { styled } from "@mui/material";

import { Avatar } from "@/components/common/display/Avatar";
import { Icon } from "@/components/common/display/Icon";
import { List } from "@/components/common/display/List";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { Dropdown } from "@/components/common/overlay/Dropdown";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { UserInfo } from "@/models/user-model";
import { useFileUpload } from "@/resources/file/useFileUpload";
import { useUserSessionProfileImageDelete } from "@/resources/user/useUserSessionProfileImageDelete";
import { useUserSessionProfileImageUpdate } from "@/resources/user/useUserSessionProfileImageUpdate";
import { useSystemToast } from "@/stores/system-toast-store";

const PROFILE_IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

interface ProfileImageEditorProps {
  userInfo: UserInfo;
}

export function ProfileImageEditor({ userInfo }: ProfileImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = useSystemToast();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { translate } = useTranslate();

  const { mutate: uploadFiles } = useFileUpload();
  const { mutate: updateProfileImage } = useUserSessionProfileImageUpdate();
  const { mutate: deleteProfileImage } = useUserSessionProfileImageDelete();

  const handleAvatarClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleUploadClick = () => {
    setAnchorEl(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("uploadFiles", file);

    uploadFiles(formData, {
      onSuccess: (response) => {
        if (!response.data.succeed) return;

        updateProfileImage(
          { fileGroupId: response.data.data.fileGroupId },
          {
            onSuccess: () => {
              toast({
                type: "success",
                message: translate(
                  TRANSLATION_KEY.user.message.PROFILE_IMAGE_CHANGE_SUCCESS,
                ),
              });
            },
          },
        );
      },
    });
  };

  const handleRemoveClick = () => {
    setAnchorEl(null);

    if (!userInfo.profileImageFileGroupId) return;

    deleteProfileImage(undefined, {
      onSuccess: () => {
        toast({
          type: "success",
          message: translate(
            TRANSLATION_KEY.user.message.PROFILE_IMAGE_REMOVE_SUCCESS,
          ),
        });
      },
    });
  };

  return (
    <>
      <StyledAvatarButton onClick={handleAvatarClick}>
        <Avatar
          name={userInfo.username}
          imageFileGroupId={userInfo.profileImageFileGroupId}
          imageFileId={userInfo.profileImageFileId}
          size="large"
        />
        <StyledEditBadge gap={0.5} align="center">
          <Icon iconName="Edit" size="xs" />
          <Text size="xs" weight="semibold" color="inherit">
            {translate(TRANSLATION_KEY.common.label.EDIT)}
          </Text>
        </StyledEditBadge>
      </StyledAvatarButton>
      <Dropdown
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleDropdownClose}
      >
        <List>
          <List.Item
            label={translate(TRANSLATION_KEY.user.label.UPLOAD_PROFILE_IMAGE)}
            onClick={handleUploadClick}
          />
          <List.Item
            label={translate(TRANSLATION_KEY.user.label.REMOVE_PROFILE_IMAGE)}
            onClick={handleRemoveClick}
          />
        </List>
      </Dropdown>
      <StyledFileInput
        ref={fileInputRef}
        type="file"
        accept={PROFILE_IMAGE_ACCEPT}
        onChange={handleFileChange}
      />
    </>
  );
}

const StyledAvatarButton = styled("button")(({ theme }) => ({
  padding: theme.spacing(0.5),

  position: "relative",

  border: "none",
  borderRadius: "50%",

  backgroundColor: theme.palette.surface.raised,
  cursor: "pointer",
}));

const StyledEditBadge = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(0.25, 1),

  position: "absolute",
  left: 0,
  bottom: 0,

  border: `1px solid ${theme.palette.scale[300]}`,
  borderRadius: theme.shape.borderRadiusScale.md,

  backgroundColor: theme.palette.surface.raised,
  color: theme.palette.scale[900],
}));

const StyledFileInput = styled("input")({
  display: "none",
});
