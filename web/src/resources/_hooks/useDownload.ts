import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { httpInstance } from "@/libs/http-instance";
import { RestResponse } from "@/models/common-model";
import { UnexpectedError } from "@/models/error-model";

type DownloadError = AxiosError<RestResponse<string>>;

interface DownloadParams {
  fileName: string;
}

export interface UseDownloadOptions {
  url: `/${string}`;
}

export function useDownload({ url }: UseDownloadOptions) {
  const saveFile = (blob: Blob, fileName: string) => {
    const fileUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = fileName;
    anchor.click();

    URL.revokeObjectURL(fileUrl);
  };

  const mutationFn = async () => {
    const response = await httpInstance.get<Blob>(url, {
      responseType: "blob",
    });

    return response.data;
  };

  const mutation = useMutation<Blob, DownloadError, DownloadParams>({
    mutationFn,
    onSuccess: (blob, { fileName }) => {
      saveFile(blob, fileName);
    },
    throwOnError: true,
  });

  const mutate = (params: DownloadParams) => {
    mutation.mutate(params, {
      onError: (error) => {
        throw new UnexpectedError(error.message);
      },
    });
  };

  return {
    ...mutation,
    mutate,
  };
}
