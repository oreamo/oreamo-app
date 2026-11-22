import { DataRecord } from "@/models/common-model";

export interface Role extends DataRecord {
  roleCode: string;
  roleName: string;
  sortOrder: number;
}

export interface RolePermission {
  menuId: string;
  permissionCode: string;
}

export interface RoleSearch {
  roleName?: string;
  permissionCodes?: string[];
  dataStatus?: string;
}

export interface RoleInfo {
  roleCode: string;
  roleName: string;
}

export interface RoleSave {
  roleCode: string;
  roleName: string;
  sortOrder: number;
  dataStatus: string;
}

export interface RoleUpdate {
  roleCode: string;
  roleName: string;
  sortOrder: number;
  dataStatus: string;
}

export interface RoleDelete {
  roleCode: string;
}

export interface RoleOperate {
  roleSaves?: RoleSave[];
  roleUpdates?: RoleUpdate[];
  roleDeletes?: RoleDelete[];
}

export interface Permission extends DataRecord {
  permissionCode: string;
  permissionName: string;
  sortOrder: number;
}

export interface PermissionInfo {
  permissionCode: string;
  permissionName: string;
}

export interface PermissionSearch {
  roleCode?: string;
  dataStatus?: string;
}

export interface PermissionSave {
  permissionCode: string;
  permissionName: string;
  sortOrder: number;
  dataStatus: string;
}

export interface PermissionUpdate {
  permissionCode: string;
  permissionName: string;
  sortOrder: number;
  dataStatus: string;
}

export interface PermissionDelete {
  permissionCode: string;
}

export interface PermissionOperate {
  permissionSaves?: PermissionSave[];
  permissionUpdates?: PermissionUpdate[];
  permissionDeletes?: PermissionDelete[];
}
