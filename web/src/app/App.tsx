import { GlobalStyles, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import { SystemLoadingBar } from "@/app/_global/SystemLoadingBar";
import { SystemModal } from "@/app/_global/SystemModal";
import { SystemToastBar } from "@/app/_global/SystemToastBar";
import { AppRouter } from "@/app/_routers/app-router";
import { queryClient } from "@/libs/query-client";
import { theme } from "@/themes/theme";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme} noSsr disableTransitionOnChange>
        <GlobalStyles
          styles={({ palette }) => ({
            html: { colorScheme: palette.mode },
            body: { backgroundColor: palette.surface.default },
          })}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <RouterProvider router={AppRouter} />
          <>
            {/* Global Components */}
            <SystemModal />
            <SystemToastBar />
            <SystemLoadingBar />
          </>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
