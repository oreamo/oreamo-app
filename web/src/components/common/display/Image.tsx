import { styled } from "@mui/material";

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fit?: "cover" | "contain";
  circle?: boolean;
}

export function Image({
  src,
  alt,
  width,
  height,
  fit = "cover",
  circle = false,
}: ImageProps) {
  return (
    <StyledImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      fit={fit}
      circle={circle}
    />
  );
}

const StyledImage = styled("img", {
  shouldForwardProp: (prop) => prop !== "fit" && prop !== "circle",
})<{ fit: "cover" | "contain"; circle: boolean }>(({ fit, circle }) => ({
  maxWidth: "100%",

  objectFit: fit,

  ...(circle && { borderRadius: "50%" }),
}));
