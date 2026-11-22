import { DataRecord } from "@/models/common-model";

export interface Translation extends DataRecord {
  translationGroup: string;
  translationType: string;
  translationCode: string;
  translationLocale: string;
  translationContent: string;
}

export interface TranslationInfo {
  translationKey: string;
  translationGroup: string;
  translationType: string;
  translationCode: string;
  translationContent: string;
}

export interface TranslationSearch {
  translationKey?: string;
  translationGroup?: string;
  translationType?: string;
  translationCode?: string;
  translationLocale?: string;
  dataStatus?: string;
}

export interface TranslationSave {
  translationGroup: string;
  translationType: string;
  translationCode: string;
  translationLocale: string;
  translationContent: string;
  dataStatus: string;
}

export interface TranslationUpdate {
  translationGroup: string;
  translationType: string;
  translationCode: string;
  translationLocale: string;
  translationContent: string;
  dataStatus: string;
}

export interface TranslationDelete {
  translationGroup: string;
  translationType: string;
  translationCode: string;
  translationLocale: string;
}

export interface TranslationOperate {
  translationSaves?: TranslationSave[];
  translationUpdates?: TranslationUpdate[];
  translationDeletes?: TranslationDelete[];
}
