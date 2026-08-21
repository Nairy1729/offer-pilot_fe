import { apiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type {
  AnalyzeJobDescriptionRequest,
  JobDescriptionAnalysis,
  JobDescriptionListItem,
} from "../types/jdAnalyzer.types";

export async function analyzeJobDescription(
  payload: AnalyzeJobDescriptionRequest
): Promise<JobDescriptionAnalysis> {
  const response = await apiClient.post<ApiResponse<JobDescriptionAnalysis>>(
    "/api/v1/jd-analyzer/analyze",
    payload
  );

  return response.data.data;
}

export async function getJobDescriptionAnalyses(): Promise<
  JobDescriptionListItem[]
> {
  const response = await apiClient.get<ApiResponse<JobDescriptionListItem[]>>(
    "/api/v1/jd-analyzer"
  );

  return response.data.data;
}

export async function getJobDescriptionAnalysisById(
  jobDescriptionId: number
): Promise<JobDescriptionAnalysis> {
  const response = await apiClient.get<ApiResponse<JobDescriptionAnalysis>>(
    `/api/v1/jd-analyzer/${jobDescriptionId}`
  );

  return response.data.data;
}

export async function deleteJobDescriptionAnalysis(
  jobDescriptionId: number
): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(
    `/api/v1/jd-analyzer/${jobDescriptionId}`
  );
}