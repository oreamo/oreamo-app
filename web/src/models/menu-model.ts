import { IconName } from "@/components/common/display/Icon";
import { DataRecord } from "@/models/common-model";

export interface Menu extends DataRecord {
  menuId: string;
  menuName: string;
  menuType: string;
  url: string;
  parentMenuId?: string;
  sortOrder: number;
  iconName?: IconName;
}

export interface MenuTreeNode {
  menuId: string;
  menuName: string;
  menuType: string;
  parentMenuId?: string;
  url?: string;
  sortOrder: number;
  iconName?: IconName;
  subMenus?: MenuTreeNode[];
}

export interface MenuSearch {
  menuName?: string;
  dataStatus?: string;
}

export interface MenuSave {
  menuId: string;
  menuName: string;
  menuType: string;
  url: string;
  parentMenuId?: string;
  sortOrder: number;
  iconName?: IconName;
  dataStatus: string;
}

export interface MenuUpdate {
  menuId: string;
  menuName: string;
  dataStatus: string;
}

export interface MenuDelete {
  menuId: string;
}

export interface MenuOperate {
  menuSaves?: MenuSave[];
  menuUpdates?: MenuUpdate[];
  menuDeletes?: MenuDelete[];
}
