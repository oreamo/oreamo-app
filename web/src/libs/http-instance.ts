import axios from "axios";

import { queryClient } from "@/libs/query-client";
import {
  AuthenticationError,
  AuthorizationError,
  UnexpectedError,
} from "@/models/error-model";

export const API_URL = import.meta.env.VITE_API_URL;
const SESSION_QUERY_KEY = "session";

export const httpInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

httpInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      throw new AuthorizationError();
    }

    if (error.response?.status !== 401) {
      throw new UnexpectedError();
    }

    if (error.config?.url === "/session/login") {
      throw new AuthenticationError();
    }

    if (error.config?.url === "/session/refresh") {
      refreshPromise = null;
      throw new AuthenticationError();
    }

    refreshPromise ??= httpInstance.put("/session/refresh").then(() => {
      refreshPromise = null;
    });

    try {
      await refreshPromise;
      return httpInstance(error.config);
    } catch {
      queryClient.removeQueries({
        queryKey: [SESSION_QUERY_KEY],
        predicate: (query) => query.state.fetchStatus !== "fetching",
      });
      throw new AuthenticationError();
    }
  },
);
