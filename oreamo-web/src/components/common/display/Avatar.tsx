import { Avatar as MuiAvatar, styled } from "@mui/material";

import { Text, TextProps } from "@/components/common/display/Text";
import { API_URL } from "@/libs/http-instance";

const AVATAR_SIZE = {
  small: { size: 32, textSize: "xs" },
  medium: { size: 36, textSize: "sm" },
  large: { size: 80, textSize: "xl" },
} as const satisfies Record<
  string,
  { size: number; textSize: TextProps["size"] }
>;

interface AvatarProps {
  name: string;
  imageFileGroupId?: string;
  imageFileId?: string;
  size?: keyof typeof AVATAR_SIZE;
}

export function Avatar({
  name,
  imageFileGroupId,
  imageFileId,
  size = "small",
}: AvatarProps) {
  const { size: avatarSize, textSize } = AVATAR_SIZE[size];

  const imageUrl =
    imageFileGroupId && imageFileId
      ? `${API_URL}/files/${imageFileGroupId}/${imageFileId}/view`
      : undefined;

  return (
    <StyledAvatar avatarSize={avatarSize} src={imageUrl}>
      <Text size={textSize} weight="semibold" color="inherit">
        {name.charAt(0).toUpperCase()}
      </Text>
    </StyledAvatar>
  );
}

const StyledAvatar = styled(MuiAvatar, {
  shouldForwardProp: (prop) => prop !== "avatarSize",
})<{ avatarSize: number }>(({ theme, avatarSize }) => ({
  width: avatarSize,
  height: avatarSize,

  backgroundColor: theme.palette.scale[900],
  color: theme.palette.scale[0],
}));
