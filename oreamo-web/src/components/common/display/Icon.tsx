import * as MuiIcons from "@mui/icons-material";

export type IconName = keyof typeof MuiIcons;

export interface IconProps {
  iconName: IconName;
  size?: "small" | "medium" | "large";
}

export function Icon({ iconName, size = "medium" }: IconProps) {
  const IconComponent = MuiIcons[iconName];

  return <IconComponent fontSize={size} />;
}
