import {
  MutateOptions,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { httpInstance } from "@/libs/http-instance";
import { RestResponse } from "@/models/common-model";
import { UnexpectedError } from "@/models/error-model";
import { useApi } from "@/resources/_hooks/useApi";
import { useSystemAlert } from "@/stores/system-dialog-store";

type HttpMethod = "post" | "put" | "patch" | "delete";
type ActionResponse<TData> = AxiosResponse<RestResponse<TData>>;
type ActionError = AxiosError<RestResponse<string>>;

export interface UseActionOptions<TParams, TData> extends Omit<
  UseMutationOptions<ActionResponse<TData>, ActionError, TParams>,
  "mutationFn"
> {
  url: `/${string}`;
  method?: HttpMethod;
  invalidateUrls?: string[];
  removeUrls?: string[];
}

export function useAction<TParams = unknown, TData = unknown>({
  url,
  method = "post",
  invalidateUrls,
  removeUrls,
  ...configs
}: UseActionOptions<TParams, TData>) {
  const queryClient = useQueryClient();
  const alert = useSystemAlert();
  const { generateQueryKey, translateFailure } = useApi();

  const mutationFn = (variables: TParams) => {
    switch (method) {
      case "post":
        return httpInstance.post<RestResponse<TData>>(url, variables);
      case "put":
        return httpInstance.put<RestResponse<TData>>(url, variables);
      case "patch":
        return httpInstance.patch<RestResponse<TData>>(url, variables);
      case "delete":
        return httpInstance.delete<RestResponse<TData>>(url, {
          data: variables,
        });
      default:
        return httpInstance.post<RestResponse<TData>>(url, variables);
    }
  };

  const mutation = useMutation<ActionResponse<TData>, ActionError, TParams>({
    mutationFn,
    ...configs,
    throwOnError: true,
  });

  const mutate = (
    variables: TParams,
    options?: MutateOptions<ActionResponse<TData>, ActionError, TParams> & {
      onFailure?: () => void;
    },
  ) => {
    const { onSuccess, onError, onFailure, ...mutateOptions } = options ?? {};

    mutation.mutate(variables, {
      ...mutateOptions,
      onSuccess: async (response, mutateVariables, onMutateResult, context) => {
        const isApiSucceed = response.data.succeed;
        if (isApiSucceed) {
          onSuccess?.(response, mutateVariables, onMutateResult, context);

          const queryKeyUrls = invalidateUrls ?? [url];

          await Promise.all(
            queryKeyUrls.map((queryKeyUrl) =>
              queryClient.invalidateQueries({
                queryKey: generateQueryKey({
                  url: queryKeyUrl,
                }),
                refetchType: "all",
              }),
            ),
          );

          removeUrls?.forEach((removeUrl) => {
            queryClient.removeQueries({
              queryKey: generateQueryKey({
                url: removeUrl,
              }),
            });
          });
          return;
        }

        const failureMessage = translateFailure({
          response: response.data,
        });

        alert({
          content: failureMessage,
        });

        onFailure?.();
      },
      onError: (error, mutateVariables, onMutateResult, context) => {
        onError?.(error, mutateVariables, onMutateResult, context);
        throw new UnexpectedError(error.message);
      },
    });
  };

  return {
    ...mutation,
    mutate,
  };
}
