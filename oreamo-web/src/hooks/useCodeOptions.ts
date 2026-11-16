import {
  GroupCodeValue,
  useCommonCodeInfos,
} from "@/resources/code/useCommonCodeInfos";

export function useCodeOptions(groupCodes: readonly GroupCodeValue[]) {
  const { data: commonCodeInfos } = useCommonCodeInfos(groupCodes);

  const getCodeOptions = (groupCode: GroupCodeValue) => {
    return (
      commonCodeInfos
        ?.filter((codeInfo) => codeInfo.groupCode === groupCode)
        .map((codeInfo) => ({
          value: codeInfo.commonCode,
          label: codeInfo.commonCodeName,
        })) ?? []
    );
  };

  const getCodeName = (groupCode: GroupCodeValue, commonCode?: string) => {
    if (!groupCode) return "";

    return (
      commonCodeInfos?.find(
        (codeInfo) =>
          codeInfo.groupCode === groupCode &&
          codeInfo.commonCode === commonCode,
      )?.commonCodeName ?? commonCode
    );
  };

  return {
    getCodeOptions,
    getCodeName,
  };
}
