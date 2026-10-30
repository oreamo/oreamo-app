import { ChangeEvent, useState } from "react";

import {
  CircularProgress,
  InputAdornment,
  keyframes,
  styled,
} from "@mui/material";

import { Icon } from "@/components/common/display/Icon";
import { TextInput, TextInputProps } from "@/components/common/input/TextInput";
import { useDebounce } from "@/hooks/useDebounce";

interface DebounceTextInputProps extends TextInputProps {
  delayTime?: number;
}

export function DebounceTextInput({
  delayTime,
  ...textInputProps
}: DebounceTextInputProps) {
  const [debounceKey, setDebounceKey] = useState(0);
  const [prevDebounceKey, setPrevDebounceKey] = useState(debounceKey);
  const [isFilled, setIsFilled] = useState(false);

  const { debounce, debounceDelayTime } = useDebounce({
    delayTime,
  });

  if (debounceKey !== prevDebounceKey) {
    setPrevDebounceKey(debounceKey);
    setIsFilled(false);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDebounceKey((key) => key + 1);

    debounce(() => {
      textInputProps.onChange?.(event);
    });
  };

  const handleAnimationEnd = () => {
    setIsFilled(true);
  };

  return (
    <TextInput
      {...textInputProps}
      onChange={handleChange}
      endAdornment={
        <InputAdornment position="end">
          {debounceKey > 0 &&
            (isFilled ? (
              <Icon iconName="Check" size="small" />
            ) : (
              <StyledDebounceProgress
                key={debounceKey}
                variant="determinate"
                value={100}
                size={16}
                duration={debounceDelayTime}
                onAnimationEnd={handleAnimationEnd}
              />
            ))}
        </InputAdornment>
      }
    />
  );
}

const fillProgress = keyframes`
  from {
    stroke-dashoffset: ${2 * Math.PI * ((44 - 3.6) / 2)};
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const StyledDebounceProgress = styled(CircularProgress, {
  shouldForwardProp: (prop) => prop !== "duration",
})<{ duration: number }>(({ duration }) => ({
  "& .MuiCircularProgress-circle": {
    animation: `${fillProgress} ${duration}ms linear forwards`,
  },
}));
