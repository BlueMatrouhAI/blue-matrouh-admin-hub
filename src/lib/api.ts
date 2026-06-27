import { mockHandle } from "./mock-data";

export const API_BASE = "/api";

export type ApiResponse<T> = {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type Options = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
};

export async function api<T = unknown>(
  path: string,
  opts: Options = {},
): Promise<ApiResponse<T>> {
  // Mock mode — no backend calls. Simulate small latency.
  await new Promise((r) => setTimeout(r, 180));
  const method = (opts.method || "GET").toUpperCase();
  const data = mockHandle(path, method, opts.body);
  return { data: data as T };
}
