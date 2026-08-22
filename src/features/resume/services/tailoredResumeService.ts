import { apiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type {
  GenerateTailoredResumeRequest,
  TailoredResume,
  TailoredResumeListItem,
} from "../types/tailoredResume.types";

function getFileNameFromContentDisposition(
  contentDisposition: string | undefined,
  fallbackFileName: string
) {
  if (!contentDisposition) {
    return fallbackFileName;
  }

  const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);

  return fileNameMatch?.[1] ?? fallbackFileName;
}

export async function generateTailoredResume(
  payload: GenerateTailoredResumeRequest
): Promise<TailoredResume> {
  const response = await apiClient.post<ApiResponse<TailoredResume>>(
    "/api/v1/tailored-resumes",
    payload
  );

  return response.data.data;
}

export async function getTailoredResumes(): Promise<TailoredResumeListItem[]> {
  const response = await apiClient.get<ApiResponse<TailoredResumeListItem[]>>(
    "/api/v1/tailored-resumes"
  );

  return response.data.data;
}

export async function getTailoredResumeById(
  tailoredResumeId: number
): Promise<TailoredResume> {
  const response = await apiClient.get<ApiResponse<TailoredResume>>(
    `/api/v1/tailored-resumes/${tailoredResumeId}`
  );

  return response.data.data;
}

export async function renderTailoredResumeLatex(
  tailoredResumeId: number
): Promise<TailoredResume> {
  const response = await apiClient.post<ApiResponse<TailoredResume>>(
    `/api/v1/tailored-resumes/${tailoredResumeId}/render-latex`
  );

  return response.data.data;
}

export async function downloadTailoredResumeLatex(
  tailoredResumeId: number,
  fallbackFileName = "tailored-resume.tex"
): Promise<void> {
  const response = await apiClient.get<Blob>(
    `/api/v1/tailored-resumes/${tailoredResumeId}/download-latex`,
    {
      responseType: "blob",
    }
  );

  const contentDisposition = response.headers["content-disposition"];
  const fileName = getFileNameFromContentDisposition(
    contentDisposition,
    fallbackFileName
  );

  const url = window.URL.createObjectURL(response.data);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();

  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export async function deleteTailoredResume(
  tailoredResumeId: number
): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(
    `/api/v1/tailored-resumes/${tailoredResumeId}`
  );
}