import { apiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type { ResumeVersion, UploadResumeRequest } from "../types/resume.types";

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

export async function uploadResume(
  payload: UploadResumeRequest
): Promise<ResumeVersion> {
  const formData = new FormData();

  formData.append("file", payload.file);

  if (payload.versionLabel) {
    formData.append("versionLabel", payload.versionLabel);
  }

  const response = await apiClient.post<ApiResponse<ResumeVersion>>(
    "/api/v1/resumes/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
}

export async function getResumes(): Promise<ResumeVersion[]> {
  const response = await apiClient.get<ApiResponse<ResumeVersion[]>>(
    "/api/v1/resumes"
  );

  return response.data.data;
}

export async function getActiveResume(): Promise<ResumeVersion> {
  const response = await apiClient.get<ApiResponse<ResumeVersion>>(
    "/api/v1/resumes/active"
  );

  return response.data.data;
}

export async function setActiveResume(
  resumeId: number
): Promise<ResumeVersion> {
  const response = await apiClient.patch<ApiResponse<ResumeVersion>>(
    `/api/v1/resumes/${resumeId}/active`
  );

  return response.data.data;
}

export async function downloadResumeFile(
  resumeId: number,
  fallbackFileName: string
): Promise<void> {
  const response = await apiClient.get<Blob>(
    `/api/v1/resumes/${resumeId}/download`,
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

export async function deleteResume(resumeId: number): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(`/api/v1/resumes/${resumeId}`);
}