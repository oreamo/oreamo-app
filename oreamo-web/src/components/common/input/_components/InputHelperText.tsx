import { InputAdornment, styled, Tooltip } from "@mui/material";

import { Icon } from "@/components/common/display/Icon";

interface InputHelperTextProps {
  helperText: string;
  error?: boolean;
}

export function InputHelperText({
  helperText,
  error = false,
}: InputHelperTextProps) {
  return (
    <InputAdornment position="start">
      <Tooltip title={helperText} placement="top-start">
        <StyledInputHelperTextIcon error={error}>
          <Icon
            iconName={error ? "ErrorOutline" : "InfoOutlined"}
            size="small"
          />
        </StyledInputHelperTextIcon>
      </Tooltip>
    </InputAdornment>
  );
}

const StyledInputHelperTextIcon = styled("span", {
  shouldForwardProp: (prop) => prop !== "error",
})<{ error: boolean }>(({ theme, error }) => ({
  display: "flex",

  color: error ? theme.palette.error.main : theme.palette.scale[500],
}));
