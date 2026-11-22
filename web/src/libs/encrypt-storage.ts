import { StateStorage } from "zustand/middleware";

import { ENV_MODE } from "@/constants/env-constant";
import { decrypt, encrypt } from "@/libs/encryptor";

const IS_ENCRYPT_ENABLED = import.meta.env.MODE === ENV_MODE.PRD;

export const encryptStorage: StateStorage = {
  getItem: (name) => {
    const value = localStorage.getItem(name);

    if (!value || !IS_ENCRYPT_ENABLED) {
      return value;
    }

    try {
      return decrypt(value) || null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, IS_ENCRYPT_ENABLED ? encrypt(value) : value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};
