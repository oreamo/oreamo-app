import { ReactNode } from "react";

import { styled } from "@mui/material";

import { Button } from "@/components/common/button/Button";
import { Icon, IconName } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { ROUTE } from "@/constants/route-constant";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useNavigator } from "@/hooks/useNavigator";
import { useTranslate } from "@/hooks/useTranslate";

interface ErrorContentProps {
  iconName: IconName;
  code: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function ErrorContent({
  iconName,
  code,
  title,
  description,
  actions,
}: ErrorContentProps) {
  const { navigate } = useNavigator();

  const { translate } = useTranslate();

  const handleGoHomeClick = () => {
    navigate(ROUTE.MAIN.URL);
  };

  const handleReloadClick = () => {
    window.location.reload();
  };

  return (
    <StyledErrorContentContainer
      direction="column"
      gap={1}
      align="center"
      justify="center"
      fullWidth
      fullHeight
    >
      <StyledErrorIcon align="center" justify="center">
        <Icon iconName={iconName} size="large" />
      </StyledErrorIcon>
      <Text size="xs" color="disabled" weight="semibold">
        {code}
      </Text>
      <Text size="xl" weight="semibold" color="primary">
        {title}
      </Text>
      <Text size="sm" color="secondary" align="center">
        {description}
      </Text>
      <StyledErrorContentWrapper gap={1}>
        <Button variant="outlined" onClick={handleGoHomeClick}>
          {translate(TRANSLATION_KEY.common.label.HOME)}
        </Button>
        <Button variant="outlined" onClick={handleReloadClick}>
          {translate(TRANSLATION_KEY.common.label.RELOAD)}
        </Button>
        {actions}
      </StyledErrorContentWrapper>
    </StyledErrorContentContainer>
  );
}

const StyledErrorContentContainer = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(4),

  backgroundColor: theme.palette.scale[50],
}));

const StyledErrorIcon = styled(Flex)(({ theme }) => ({
  width: 64,
  height: 64,

  marginBottom: theme.spacing(1),

  borderRadius: "50%",

  backgroundColor: theme.palette.scale[100],
  color: theme.palette.scale[500],
}));

const StyledErrorContentWrapper = styled(Flex)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));
