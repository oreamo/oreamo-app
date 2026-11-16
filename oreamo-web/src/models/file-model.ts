export interface FileInfo {
  fileGroupId: string;
  fileId: string;
  fileName: string;
  fileExtension: string;
  fileContentType: string;
  fileSize: number;
}

export interface FileGroup {
  fileGroupId: string;
  files: FileInfo[];
}
