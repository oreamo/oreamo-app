import CryptoJS from "crypto-js";

const ENCRYPT_SECRET_KEY = import.meta.env.VITE_ENCRYPT_SECRET_KEY;

export function encrypt(value: string) {
  return CryptoJS.AES.encrypt(value, ENCRYPT_SECRET_KEY).toString();
}

export function decrypt(value: string) {
  return CryptoJS.AES.decrypt(value, ENCRYPT_SECRET_KEY).toString(
    CryptoJS.enc.Utf8,
  );
}
