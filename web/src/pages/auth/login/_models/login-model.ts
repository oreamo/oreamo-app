import { UserPasswordChange } from "@/models/user-model";

export interface UserPasswordChangeForm extends UserPasswordChange {
  confirmPassword: string;
}
