import { UserSessionPasswordChange } from "@/models/user-model";

export interface UserSessionPasswordChangeForm extends UserSessionPasswordChange {
  confirmPassword: string;
}
