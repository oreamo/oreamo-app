import { useTranslate } from "@/hooks/useTranslate";
import { FailureRestResponse } from "@/models/common-model";

export function useApi() {
  const { translateSequential } = useTranslate();

  const generateQueryKey = ({
    url,
    params,
  }: {
    url: string;
    params?: Record<string, unknown>;
  }) => {
    const urlSegments = url.slice(1).split("/");

    if (params === undefined) {
      return urlSegments;
    }

    return [...urlSegments, params];
  };

  const translateFailure = ({
    response,
  }: {
    response: FailureRestResponse;
  }) => {
    const failure = response.failure;
    return translateSequential(
      failure.failureMessageKey,
      ...(failure.failureLabelKeys ?? []),
    );
  };

  return {
    generateQueryKey,
    translateFailure,
  };
}
