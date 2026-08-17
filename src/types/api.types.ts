export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
  path: string | null;
  timestamp: string;
};

export type ApiErrorResponse<TData = unknown> = {
  success: false;
  message: string;
  data: TData | null;
  errorCode: string;
  path: string;
  timestamp: string;
};

export type ValidationErrors = Record<string, string>;