import { apiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type {
  ApplicationFilters,
  ApplicationSummary,
  CreateApplicationRequest,
  JobApplication,
  UpdateApplicationRequest,
  UpdateApplicationStatusRequest,
} from "../types/application.types";

export async function createApplication(
  payload: CreateApplicationRequest
): Promise<JobApplication> {
  const response = await apiClient.post<ApiResponse<JobApplication>>(
    "/api/v1/applications",
    payload
  );

  return response.data.data;
}

export async function getApplications(
  filters?: ApplicationFilters
): Promise<JobApplication[]> {
  const response = await apiClient.get<ApiResponse<JobApplication[]>>(
    "/api/v1/applications",
    {
      params: {
        status: filters?.status,
        search: filters?.search,
      },
    }
  );

  return response.data.data;
}

export async function getApplicationById(
  applicationId: number
): Promise<JobApplication> {
  const response = await apiClient.get<ApiResponse<JobApplication>>(
    `/api/v1/applications/${applicationId}`
  );

  return response.data.data;
}

export async function getApplicationSummary(): Promise<ApplicationSummary> {
  const response = await apiClient.get<ApiResponse<ApplicationSummary>>(
    "/api/v1/applications/summary"
  );

  return response.data.data;
}

export async function updateApplication(
  applicationId: number,
  payload: UpdateApplicationRequest
): Promise<JobApplication> {
  const response = await apiClient.put<ApiResponse<JobApplication>>(
    `/api/v1/applications/${applicationId}`,
    payload
  );

  return response.data.data;
}

export async function updateApplicationStatus(
  applicationId: number,
  payload: UpdateApplicationStatusRequest
): Promise<JobApplication> {
  const response = await apiClient.patch<ApiResponse<JobApplication>>(
    `/api/v1/applications/${applicationId}/status`,
    payload
  );

  return response.data.data;
}

export async function deleteApplication(applicationId: number): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(
    `/api/v1/applications/${applicationId}`
  );
}