import * as MuiIcons from "@mui/icons-material";

export type IconName = keyof typeof MuiIcons;

export interface IconProps {
  iconName: IconName;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Icon({ iconName, size = "md" }: IconProps) {
  const IconComponent = MuiIcons[iconName];

  return <IconComponent fontSize={size} />;
}
