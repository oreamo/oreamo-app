import { ENV_MODE } from "@/constants/env-constant";

const CURRENT_ENV_MODE = import.meta.env.MODE;

export function useEnvironment() {
  const isLocalMode = CURRENT_ENV_MODE === ENV_MODE.LOCAL;
  const isDevelopment = CURRENT_ENV_MODE === ENV_MODE.DEV;
  const isProduction = CURRENT_ENV_MODE === ENV_MODE.PRD;

  return {
    isLocalMode,
    isDevelopment,
    isProduction,
  };
}
