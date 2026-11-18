import { useContext, useState } from "react";

import { InputAdornment, styled, Tooltip } from "@mui/material";

import { Icon } from "@/components/common/display/Icon";
import { InputHelperTextContext } from "@/components/common/input/input-helper-text-context";

interface InputHelperTextProps {
  helperText: string;
  error?: boolean;
}

export function InputHelperText({
  helperText,
  error = false,
}: InputHelperTextProps) {
  const { autoOpen } = useContext(InputHelperTextContext);

  const [hoverOpen, setHoverOpen] = useState(false);

  const handleOpen = () => {
    setHoverOpen(true);
  };

  const handleClose = () => {
    setHoverOpen(false);
  };

  const open = hoverOpen || (error && autoOpen);

  return (
    <InputAdornment position="start">
      <Tooltip
        title={helperText}
        placement="top-start"
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        <StyledInputHelperTextIcon error={error}>
          <Icon iconName={error ? "ErrorOutline" : "InfoOutlined"} size="sm" />
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
