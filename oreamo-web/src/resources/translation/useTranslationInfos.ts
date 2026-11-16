import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { httpInstance } from "@/libs/http-instance";
import { RestResponse } from "@/models/common-model";
import { TranslationInfo } from "@/models/translation-model";

export function useTranslationInfos() {
  return useQuery({
    queryKey: ["translations", "infos"],
    queryFn: () => {
      return httpInstance.get("/translations/infos");
    },
    select: (response: AxiosResponse<RestResponse<TranslationInfo[]>>) => {
      return response.data.succeed ? response.data.data : undefined;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    throwOnError: false,
  });
}
