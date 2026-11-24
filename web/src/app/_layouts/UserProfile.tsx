import { MouseEvent, useState } from "react";

import { ButtonBase, styled, useColorScheme } from "@mui/material";

import { Switch } from "@/components/common/button/Switch";
import { Toggle } from "@/components/common/button/Toggle";
import { Avatar } from "@/components/common/display/Avatar";
import { Divider } from "@/components/common/display/Divider";
import { Icon } from "@/components/common/display/Icon";
import { List } from "@/components/common/display/List";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { Dropdown } from "@/components/common/overlay/Dropdown";
import { ROUTE } from "@/constants/route-constant";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useMedia } from "@/hooks/useMedia";
import { useNavigator } from "@/hooks/useNavigator";
import { useTranslate } from "@/hooks/useTranslate";
import { useSessionUserInfo } from "@/resources/user/useSessionUserInfo";
import { useSessionUserLogout } from "@/resources/user/useSessionUserLogout";
import { useMenuTabActions, useMenuTabEnabled } from "@/stores/menu-tab-store";
import { useSidebarActions, useSidebarOpen } from "@/stores/sidebar-store";
import { useSystemToast } from "@/stores/system-toast-store";

type ColorMode = "light" | "dark" | "system";

export function UserProfile() {
  const { navigate } = useNavigator();

  const toast = useSystemToast();
  const { mode, setMode } = useColorScheme();
  const isMenuTabEnabled = useMenuTabEnabled();
  const { setEnabled: setMenuTabEnabled } = useMenuTabActions();
  const isSidebarOpen = useSidebarOpen();
  const { setOpen: setSidebarOpen } = useSidebarActions();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
    navigate(ROUTE.SETTING.USER_SETTING.PROFILE.URL);
  };

  const handleColorModeChange = (value?: string) => {
    if (!value) return;

    setMode(value as ColorMode);
  };

  const handleMenuTabEnabledChange = (checked: boolean) => {
    setMenuTabEnabled(checked);
  };

  const handleSidebarOpenChange = (checked: boolean) => {
    setSidebarOpen(checked);
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
        <Avatar
          name={userInfo.username}
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
            <Avatar
              name={userInfo.username}
              imageFileGroupId={userInfo.profileImageFileGroupId}
              imageFileId={userInfo.profileImageFileId}
              size="medium"
            />
            <Flex direction="column">
              <Text weight="semibold">{userInfo.name}</Text>
              <Text size="xs" color="secondary">
                {userInfo.username}
              </Text>
            </Flex>
          </StyledUserProfileWrapper>
          <Divider />
          <List>
            <List.Item
              iconName="ManageAccountsOutlined"
              label={translate(TRANSLATION_KEY.user.label.PROFILE)}
              onClick={handleEditProfileClick}
            />
          </List>
          <Divider />
          <StyledPreferenceContainer justify="between" align="center" gap={2}>
            <Flex gap={2} align="center">
              <Icon iconName="ContrastOutlined" size="sm" />
              <Text size="sm" color="inherit">
                {translate(TRANSLATION_KEY.user.label.THEME)}
              </Text>
            </Flex>
            <Toggle
              value={mode}
              options={[
                {
                  value: "light",
                  label: <Icon iconName="LightModeOutlined" size="sm" />,
                },
                {
                  value: "dark",
                  label: <Icon iconName="DarkModeOutlined" size="sm" />,
                },
                {
                  value: "system",
                  label: (
                    <Icon iconName="SettingsBrightnessOutlined" size="sm" />
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
                <Icon iconName="TabOutlined" size="sm" />
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
          {isDesktop && (
            <StyledPreferenceContainer justify="between" align="center" gap={2}>
              <Flex gap={2} align="center">
                <Icon iconName="MenuOpenOutlined" size="sm" />
                <Text size="sm" color="inherit">
                  {translate(TRANSLATION_KEY.user.label.SIDEBAR)}
                </Text>
              </Flex>
              <Switch
                checked={isSidebarOpen}
                size="small"
                onChange={handleSidebarOpenChange}
              />
            </StyledPreferenceContainer>
          )}
          <Divider />
          <List>
            <List.Item
              iconName="Logout"
              label={translate(TRANSLATION_KEY.user.label.SIGN_OUT)}
              onClick={handleLogoutClick}
            />
          </List>
        </StyledUserProfileContainer>
      </Dropdown>
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
