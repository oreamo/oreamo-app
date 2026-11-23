import { useState } from "react";

import { styled } from "@mui/material";

import { Flex } from "@/components/common/layout/Flex";
import { LoginForm } from "@/pages/auth/login/_components/LoginForm";
import { PasswordChangeForm } from "@/pages/auth/login/_components/PasswordChangeForm";

export function LoginPage() {
  const [passwordChangeUsername, setPasswordChangeUsername] =
    useState<string>();

  const handlePasswordChangeRequire = (username: string) => {
    setPasswordChangeUsername(username);
  };

  const handlePasswordChangeClose = () => {
    setPasswordChangeUsername(undefined);
  };

  const isPasswordChangeOpen = !!passwordChangeUsername;

  return (
    <StyledLoginPageContainer
      align="center"
      justify="center"
      fullWidth
      fullHeight
    >
      <StyledLoginSliderContainer>
        <StyledLoginSliderWrapper passwordChangeOpen={isPasswordChangeOpen}>
          <StyledLoginSliderGroup inert={isPasswordChangeOpen}>
            <LoginForm onPasswordChangeRequire={handlePasswordChangeRequire} />
          </StyledLoginSliderGroup>
          <StyledLoginSliderGroup inert={!isPasswordChangeOpen}>
            <PasswordChangeForm
              username={passwordChangeUsername}
              onClose={handlePasswordChangeClose}
            />
          </StyledLoginSliderGroup>
        </StyledLoginSliderWrapper>
      </StyledLoginSliderContainer>
    </StyledLoginPageContainer>
  );
}

const StyledLoginPageContainer = styled(Flex)(({ theme }) => ({
  backgroundColor: theme.palette.scale[50],
}));

const StyledLoginSliderContainer = styled("div")(({ theme }) => ({
  width: 400,

  overflow: "clip",

  border: `1px solid ${theme.palette.scale[300]}`,
  borderRadius: theme.shape.borderRadiusScale.lg,

  backgroundColor: theme.palette.surface.raised,
}));

const StyledLoginSliderWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "passwordChangeOpen",
})<{ passwordChangeOpen: boolean }>(({ theme, passwordChangeOpen }) => ({
  display: "flex",
  alignItems: "center",
  transform: passwordChangeOpen ? "translateX(-100%)" : "translateX(0)",
  transition: theme.transitions.create("transform"),
}));

const StyledLoginSliderGroup = styled("div")(({ theme }) => ({
  padding: theme.spacing(5),

  flex: "0 0 100%",
}));
