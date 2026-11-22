import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { httpInstance } from "@/libs/http-instance";
import { RestResponse } from "@/models/common-model";
import { useApi } from "@/resources/_hooks/useApi";
import { useSystemAlert } from "@/stores/system-dialog-store";

export interface UseFetchOptions<T> extends Omit<
  UseQueryOptions<
    AxiosResponse<RestResponse<T>>,
    AxiosError<RestResponse<string>>,
    T | undefined
  >,
  "queryFn" | "queryKey" | "select"
> {
  url: `/${string}`;
  params?: Record<string, unknown>;
  onFailure?: () => void;
}

export function useFetch<TData>({
  url,
  params,
  onFailure,
  ...configs
}: UseFetchOptions<TData>) {
  const queryClient = useQueryClient();
  const alert = useSystemAlert();
  const { generateQueryKey, translateFailure } = useApi();

  const queryKey = generateQueryKey({
    url,
    params,
  });

  const queryFn = () => {
    return httpInstance.get(url, {
      params,
    });
  };

  const select = (response: AxiosResponse<RestResponse<TData>>) => {
    const isApiSucceed = response.data.succeed;
    if (isApiSucceed) {
      return response.data.data;
    }

    const failureMessage = translateFailure({
      response: response.data,
    });

    alert({
      content: failureMessage,
    });

    onFailure?.();
  };

  const fetch = () => {
    queryClient.invalidateQueries({ queryKey, refetchType: "active" });
  };

  const query = useQuery<
    AxiosResponse<RestResponse<TData>>,
    AxiosError<RestResponse<string>>,
    TData | undefined
  >({
    queryFn,
    queryKey,
    select,
    throwOnError: true,
    ...configs,
  });

  return {
    ...query,
    fetch,
  };
}
