import { styled } from "@mui/material";

import { Chip } from "@/components/common/display/Chip";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { UserInfo } from "@/models/user-model";
import { ProfileImageEditor } from "@/pages/setting/user/profile/_components/ProfileImageEditor";
import { useRoleInfos } from "@/resources/authority/useRoleInfos";

interface ProfileCardProps {
  userInfo: UserInfo;
}

export function ProfileCard({ userInfo }: ProfileCardProps) {
  const { data: roleInfos = [] } = useRoleInfos();

  const roleName =
    roleInfos.find((roleInfo) => roleInfo.roleCode === userInfo.roleCode)
      ?.roleName ?? userInfo.roleCode;

  return (
    <StyledProfileCardContainer direction="column">
      <StyledCover />
      <StyledProfileCardWrapper direction="column" gap={1.5}>
        <StyledProfileCardGroup>
          <ProfileImageEditor userInfo={userInfo} />
        </StyledProfileCardGroup>
        <Flex direction="column" gap={0.5}>
          <Text size="xl" weight="bold">
            {userInfo.name}
          </Text>
          <Text size="sm" color="secondary">
            {userInfo.username}
          </Text>
          <Flex>
            <Chip label={roleName} size="small" />
          </Flex>
        </Flex>
      </StyledProfileCardWrapper>
    </StyledProfileCardContainer>
  );
}

const StyledProfileCardContainer = styled(Flex)(({ theme }) => ({
  overflow: "hidden",

  border: `1px solid ${theme.palette.scale[300]}`,
  borderRadius: theme.shape.borderRadiusScale.lg,

  backgroundColor: theme.palette.surface.raised,
}));

const StyledCover = styled("div")(({ theme }) => ({
  height: 112,

  backgroundColor: theme.palette.scale[200],
}));

const StyledProfileCardWrapper = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3),
}));

const StyledProfileCardGroup = styled(Flex)({
  marginTop: -44,

  alignSelf: "flex-start",
});
