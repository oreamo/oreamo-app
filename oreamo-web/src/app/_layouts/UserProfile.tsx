import { MouseEvent, useState } from "react";

import {
  ButtonBase,
  Divider,
  MenuItem,
  MenuList,
  styled,
  useColorScheme,
} from "@mui/material";

import { UserAvatar } from "@/app/_layouts/UserAvatar";
import { UserProfileModal } from "@/app/_layouts/UserProfileModal";
import { Switch } from "@/components/common/button/Switch";
import { Toggle } from "@/components/common/button/Toggle";
import { Icon } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { Dropdown } from "@/components/common/overlay/Dropdown";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useMedia } from "@/hooks/useMedia";
import { useTranslate } from "@/hooks/useTranslate";
import { useSessionUserInfo } from "@/resources/user/useSessionUserInfo";
import { useSessionUserLogout } from "@/resources/user/useSessionUserLogout";
import { useMenuTabActions, useMenuTabEnabled } from "@/stores/menu-tab-store";
import { useSystemToast } from "@/stores/system-toast-store";

type ColorMode = "light" | "dark" | "system";

export function UserProfile() {
  const toast = useSystemToast();
  const { mode, setMode } = useColorScheme();
  const isMenuTabEnabled = useMenuTabEnabled();
  const { setEnabled: setMenuTabEnabled } = useMenuTabActions();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { isDesktop } = useMedia();
  const { translate } = useTranslate();

  const { data: userInfo } = useSessionUserInfo();
  const { mutate: logout } = useSessionUserLogout();

  const handleProfileClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfileClick = () => {
    setAnchorEl(null);
    setProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
  };

  const handleColorModeChange = (value?: string) => {
    if (!value) return;

    setMode(value as ColorMode);
  };

  const handleMenuTabEnabledChange = (checked: boolean) => {
    setMenuTabEnabled(checked);
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);

    logout(undefined, {
      onSuccess: () => {
        toast({
          type: "info",
          message: translate(TRANSLATION_KEY.user.message.LOGOUT_SUCCESS),
        });
      },
    });
  };

  if (!userInfo) return null;

  return (
    <>
      <StyledUserProfileButton onClick={handleProfileClick}>
        <UserAvatar
          username={userInfo.username}
          imageFileGroupId={userInfo.profileImageFileGroupId}
          imageFileId={userInfo.profileImageFileId}
        />
      </StyledUserProfileButton>
      <Dropdown
        open={!!anchorEl}
        anchorEl={anchorEl}
        align="right"
        onClose={handleDropdownClose}
      >
        <StyledUserProfileContainer direction="column" gap={1}>
          <StyledUserProfileWrapper gap={2} align="center">
            <UserAvatar
              username={userInfo.username}
              imageFileGroupId={userInfo.profileImageFileGroupId}
              imageFileId={userInfo.profileImageFileId}
              size="medium"
            />
            <Text weight="semibold">{userInfo.username}</Text>
          </StyledUserProfileWrapper>
          <Divider />
          <MenuList disablePadding>
            <MenuItem onClick={handleEditProfileClick}>
              <Flex gap={2} align="center">
                <Icon iconName="ManageAccountsOutlined" size="small" />
                <Text size="sm" color="inherit">
                  {translate(TRANSLATION_KEY.user.label.EDIT_PROFILE)}
                </Text>
              </Flex>
            </MenuItem>
          </MenuList>
          <Divider />
          <StyledPreferenceContainer justify="between" align="center" gap={2}>
            <Flex gap={2} align="center">
              <Icon iconName="ContrastOutlined" size="small" />
              <Text size="sm" color="inherit">
                {translate(TRANSLATION_KEY.user.label.THEME)}
              </Text>
            </Flex>
            <Toggle
              value={mode}
              options={[
                {
                  value: "light",
                  label: <Icon iconName="LightModeOutlined" size="small" />,
                },
                {
                  value: "dark",
                  label: <Icon iconName="DarkModeOutlined" size="small" />,
                },
                {
                  value: "system",
                  label: (
                    <Icon iconName="SettingsBrightnessOutlined" size="small" />
                  ),
                },
              ]}
              size="small"
              onChange={handleColorModeChange}
            />
          </StyledPreferenceContainer>
          {isDesktop && (
            <StyledPreferenceContainer justify="between" align="center" gap={2}>
              <Flex gap={2} align="center">
                <Icon iconName="TabOutlined" size="small" />
                <Text size="sm" color="inherit">
                  {translate(TRANSLATION_KEY.user.label.MENU_TAB)}
                </Text>
              </Flex>
              <Switch
                checked={isMenuTabEnabled}
                size="small"
                onChange={handleMenuTabEnabledChange}
              />
            </StyledPreferenceContainer>
          )}
          <Divider />
          <MenuList disablePadding>
            <MenuItem onClick={handleLogoutClick}>
              <Flex gap={2} align="center">
                <Icon iconName="Logout" size="small" />
                <Text size="sm" color="inherit">
                  {translate(TRANSLATION_KEY.user.label.SIGN_OUT)}
                </Text>
              </Flex>
            </MenuItem>
          </MenuList>
        </StyledUserProfileContainer>
      </Dropdown>
      {profileModalOpen && (
        <UserProfileModal
          open={profileModalOpen}
          userInfo={userInfo}
          onClose={handleProfileModalClose}
        />
      )}
    </>
  );
}

const StyledUserProfileButton = styled(ButtonBase)({
  borderRadius: "50%",
});

const StyledUserProfileContainer = styled(Flex)(({ theme }) => ({
  minWidth: 240,

  padding: theme.spacing(2),
}));

const StyledUserProfileWrapper = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const StyledPreferenceContainer = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(0.75, 4),

  color: theme.palette.scale[700],
}));
