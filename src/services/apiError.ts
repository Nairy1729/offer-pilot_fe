import axios from "axios";
import type {
  ApiErrorResponse,
  ValidationErrors,
} from "../types/api.types";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again."
) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export function getApiErrorCode(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.errorCode ?? null;
  }

  return null;
}

export function getApiFieldErrors(error: unknown): ValidationErrors | null {
  if (!axios.isAxiosError<ApiErrorResponse<ValidationErrors>>(error)) {
    return null;
  }

  const responseData = error.response?.data;

  if (responseData?.errorCode !== "VALIDATION_ERROR") {
    return null;
  }

  if (!responseData.data) {
    return null;
  }

  return responseData.data;
}