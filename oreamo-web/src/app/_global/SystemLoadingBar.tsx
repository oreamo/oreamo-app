import { CircularProgress, styled } from "@mui/material";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

import { Flex } from "@/components/common/layout/Flex";

export function SystemLoadingBar() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) return null;

  return (
    <StyledSystemLoadingBarContainer align="center" justify="center">
      <CircularProgress />
    </StyledSystemLoadingBarContainer>
  );
}

const StyledSystemLoadingBarContainer = styled(Flex)({
  width: "100vw",
  height: "100vh",

  position: "fixed",
  top: 0,
  left: 0,
});
