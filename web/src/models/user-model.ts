import { RolePermission } from "@/models/authority-model";
import { DataRecord } from "@/models/common-model";

export interface LoginInfo {
  username: string;
  password: string;
}

export interface UserInfo {
  username: string;
  name: string;
  email: string;
  roleCode: string;
  rolePermissions: RolePermission[];
  profileImageFileGroupId?: string;
  profileImageFileId?: string;
}

export interface UserSessionUpdate {
  name: string;
  email: string;
}

export interface UserProfileImageUpdate {
  fileGroupId: string;
}

export interface User extends DataRecord {
  username: string;
  name: string;
  email: string;
  password?: string;
  roleCode: string;
}

export interface UserSearch {
  username?: string;
  roleCode?: string;
  dataStatus?: string;
}

export interface UserSave {
  username: string;
  name: string;
  email: string;
  password?: string;
  roleCode: string;
  dataStatus: string;
}

export interface UserUpdate {
  username: string;
  name: string;
  email: string;
  roleCode: string;
  dataStatus: string;
}

export interface UserPasswordReset {
  username: string;
}

export interface UserDelete {
  username: string;
}

export interface UserOperate {
  userSaves?: UserSave[];
  userUpdates?: UserUpdate[];
  userDeletes?: UserDelete[];
}

export enum AuthorityRole {
  SYSTEM = "ROLE_SYSTEM",
  ADMIN = "ROLE_ADMIN",
  MANAGER = "ROLE_MANAGER",
  USER = "ROLE_USER",
}
