import { styled } from "@mui/material";

import { Flex } from "@/components/common/layout/Flex";
import { LoginForm } from "@/pages/auth/login/_components/LoginForm";

export function LoginPage() {
  return (
    <StyledLoginPageContainer
      align="center"
      justify="center"
      fullWidth
      fullHeight
    >
      <LoginForm />
    </StyledLoginPageContainer>
  );
}

const StyledLoginPageContainer = styled(Flex)(({ theme }) => ({
  backgroundColor: theme.palette.scale[50],
}));
