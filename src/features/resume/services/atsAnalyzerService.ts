import { apiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type {
  AnalyzeAtsRequest,
  AtsAnalysis,
  AtsAnalysisListItem,
  AtsCompareRequest,
  AtsCompareResponse,
} from "../types/atsAnalyzer.types";

export async function analyzeSavedResumeForAts(
  payload: AnalyzeAtsRequest
): Promise<AtsAnalysis> {
  const response = await apiClient.post<ApiResponse<AtsAnalysis>>(
    "/api/v1/ats/analyses",
    payload
  );

  return response.data.data;
}

export async function analyzeExternalResumeForAts(payload: {
  file: File;
  jobDescriptionId: number;
}): Promise<AtsAnalysis> {
  const formData = new FormData();

  formData.append("file", payload.file);
  formData.append("jobDescriptionId", String(payload.jobDescriptionId));

  const response = await apiClient.post<ApiResponse<AtsAnalysis>>(
    "/api/v1/ats/analyses/external",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
}

export async function getAtsAnalyses(): Promise<AtsAnalysisListItem[]> {
  const response = await apiClient.get<ApiResponse<AtsAnalysisListItem[]>>(
    "/api/v1/ats/analyses"
  );

  return response.data.data;
}

export async function getAtsAnalysisById(
  analysisId: number
): Promise<AtsAnalysis> {
  const response = await apiClient.get<ApiResponse<AtsAnalysis>>(
    `/api/v1/ats/analyses/${analysisId}`
  );

  return response.data.data;
}

export async function deleteAtsAnalysis(analysisId: number): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(
    `/api/v1/ats/analyses/${analysisId}`
  );
}

export async function compareAtsResumes(
  payload: AtsCompareRequest
): Promise<AtsCompareResponse> {
  const response = await apiClient.post<ApiResponse<AtsCompareResponse>>(
    "/api/v1/ats/analyses/compare",
    payload
  );

  return response.data.data;
}