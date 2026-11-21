import type { ThemeOptions } from "@mui/material";

export const switchTheme: ThemeOptions = {
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const small = ownerState.size === "small";

          const trackWidth = small ? 32 : 40;
          const trackHeight = small ? 18 : 24;
          const thumbSize = small ? 12 : 18;
          const margin = 3;
          const translateX = trackWidth - thumbSize - margin * 2;

          return {
            width: trackWidth,
            height: trackHeight,
            padding: 0,

            "& .MuiSwitch-switchBase": {
              padding: 0,
              margin,
              transitionDuration: theme.transitions.duration.short,
              "&.Mui-checked": {
                transform: `translateX(${translateX}px)`,
                "& + .MuiSwitch-track": {
                  backgroundColor: theme.palette.primary.main,
                  opacity: 1,
                },
              },
              "&.Mui-checked.Mui-disabled + .MuiSwitch-track": {
                backgroundColor: theme.palette.scale[200],
              },
              "&.Mui-disabled .MuiSwitch-thumb": {
                backgroundColor: theme.palette.scale[300],
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                backgroundColor: theme.palette.scale[100],
                opacity: 1,
              },
              "&.Mui-focusVisible .MuiSwitch-thumb": {
                outline: `2px solid ${theme.palette.scale[600]}`,
                outlineOffset: 2,
              },
            },

            "& .MuiSwitch-thumb": {
              width: thumbSize,
              height: thumbSize,

              boxSizing: "border-box",
              boxShadow: theme.shadows[1],

              backgroundColor: theme.palette.scale[0],
            },

            "& .MuiSwitch-track": {
              borderRadius: trackHeight / 2,

              backgroundColor: theme.palette.scale[300],
              opacity: 1,

              transition: theme.transitions.create(["background-color"], {
                duration: theme.transitions.duration.short,
              }),
            },
          };
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          marginLeft: 0,
          marginRight: 0,
          gap: theme.spacing(1),
        }),
      },
    },
  },
};
