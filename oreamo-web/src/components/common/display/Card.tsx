import { ReactNode } from "react";

import { styled } from "@mui/material";

import { Flex } from "@/components/common/layout/Flex";

interface CardProps {
  children?: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <StyledCardContainer direction="column" gap={1} fullWidth>
      {children}
    </StyledCardContainer>
  );
}

const StyledCardContainer = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(2),

  borderRadius: theme.shape.borderRadiusScale.lg,
  border: `1px solid ${theme.palette.scale[300]}`,

  backgroundColor: theme.palette.surface.raised,
}));
