import { DataRecord } from "@/models/common-model";

export interface GroupCode extends DataRecord {
  groupCode: string;
  groupCodeName: string;
  groupCodeDescription?: string;
  sortOrder: number;
  commonCodes: CommonCode[];
}

export interface GroupCodeSearch {
  groupCodeName?: string;
  commonCodeName?: string;
  dataStatus?: string;
}

export interface GroupCodeSave {
  groupCode: string;
  groupCodeName: string;
  groupCodeDescription?: string;
  dataStatus: string;
  sortOrder: number;
}

export interface GroupCodeUpdate {
  groupCode: string;
  groupCodeName: string;
  groupCodeDescription?: string;
  dataStatus: string;
}

export interface GroupCodeDelete {
  groupCode: string;
}

export interface GroupCodeOperate {
  groupCodeSaves?: GroupCodeSave[];
  groupCodeUpdates?: GroupCodeUpdate[];
  groupCodeDeletes?: GroupCodeDelete[];
}

export interface CommonCode extends DataRecord {
  groupCode: string;
  commonCode: string;
  commonCodeName: string;
  commonCodeDescription: string;
  sortOrder: number;
}

export interface CommonCodeInfo {
  groupCode: string;
  commonCode: string;
  commonCodeName: string;
}

export interface CommonCodeSearch {
  groupCode?: string;
}

export interface CommonCodeSave {
  groupCode: string;
  commonCode: string;
  commonCodeName: string;
  commonCodeDescription?: string;
  dataStatus: string;
  sortOrder: number;
}

export interface CodeSearch {
  groupCodes?: string[];
}

export interface CommonCodeUpdate {
  groupCode: string;
  commonCode: string;
  commonCodeName: string;
  commonCodeDescription?: string;
  dataStatus: string;
}

export interface CommonCodeDelete {
  groupCode: string;
  commonCode: string;
}

export interface CommonCodeOperate {
  commonCodeSaves?: CommonCodeSave[];
  commonCodeUpdates?: CommonCodeUpdate[];
  commonCodeDeletes?: CommonCodeDelete[];
}
