export type ResumeVersion = {
  id: number;
  userId: number;
  versionLabel: string | null;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  active: boolean;
  uploadedAt: string;
};

export type UploadResumeRequest = {
  file: File;
  versionLabel?: string;
};

export type DashboardResumeSummary = {
  totalResumes: number;
  hasActiveResume: boolean;
  activeResumeId: number | null;
  activeResumeName: string | null;
  activeResumeOriginalFileName: string | null;
  activeResumeUploadedAt: string | null;
};