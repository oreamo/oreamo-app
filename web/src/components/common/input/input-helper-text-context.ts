import { createContext } from "react";

interface InputHelperTextContextValue {
  autoOpen: boolean;
}

export const InputHelperTextContext =
  createContext<InputHelperTextContextValue>({
    autoOpen: false,
  });
