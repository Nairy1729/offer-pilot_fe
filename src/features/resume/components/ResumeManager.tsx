import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  getApiErrorCode,
  getApiErrorMessage,
} from "../../../services/apiError";
import {
  deleteResume,
  downloadResumeFile,
  getActiveResume,
  getResumes,
  setActiveResume,
  uploadResume,
} from "../services/resumeService";
import type { ResumeVersion } from "../types/resume.types";

const maxFileSizeBytes = 5 * 1024 * 1024;

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "Not set";
  }

  const [year, month, day] = dateValue.slice(0, 10).split("-");

  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day}-${month}-${year}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeLabel(contentType: string) {
  if (contentType === "application/pdf") {
    return "PDF";
  }

  if (contentType === "application/msword") {
    return "DOC";
  }

  if (
    contentType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "DOCX";
  }

  return "File";
}

function getResumeDisplayName(resume: ResumeVersion) {
  return resume.versionLabel || resume.originalFileName;
}

function isAllowedResumeFile(file: File) {
  if (allowedMimeTypes.includes(file.type)) {
    return true;
  }

  const fileName = file.name.toLowerCase();

  return (
    fileName.endsWith(".pdf") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  );
}

export function ResumeManager() {
  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [activeResume, setActiveResumeState] = useState<ResumeVersion | null>(
    null
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [versionLabel, setVersionLabel] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [actionResumeId, setActionResumeId] = useState<number | null>(null);
  const [downloadingResumeId, setDownloadingResumeId] = useState<number | null>(
    null
  );

  const [pageError, setPageError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadResumeData() {
    try {
      setPageError(null);

      const resumeList = await getResumes();

      setResumes(resumeList);

      try {
        const active = await getActiveResume();
        setActiveResumeState(active);
      } catch (error) {
        const errorCode = getApiErrorCode(error);

        if (errorCode === "RESOURCE_NOT_FOUND") {
          setActiveResumeState(null);
          return;
        }

        throw error;
      }
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to load resumes."));
    }
  }

  useEffect(() => {
    async function initialLoad() {
      try {
        setIsLoading(true);
        await loadResumeData();
      } finally {
        setIsLoading(false);
      }
    }

    initialLoad();
  }, []);

  function handleFileChange(file: File | null) {
    setUploadError(null);
    setSelectedFile(file);

    if (!file) {
      return;
    }

    if (!isAllowedResumeFile(file)) {
      setUploadError("Only PDF, DOC, and DOCX files are allowed.");
      setSelectedFile(null);
      return;
    }

    if (file.size > maxFileSizeBytes) {
      setUploadError("Resume file must be smaller than 5 MB.");
      setSelectedFile(null);
    }
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setUploadError("Please select a resume file.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setPageError(null);
      setSuccessMessage(null);

      await uploadResume({
        file: selectedFile,
        versionLabel: versionLabel.trim() || undefined,
      });

      setSelectedFile(null);
      setVersionLabel("");
      setSuccessMessage("Resume uploaded successfully.");
      await loadResumeData();
    } catch (error) {
      setUploadError(getApiErrorMessage(error, "Unable to upload resume."));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSetActive(resume: ResumeVersion) {
    try {
      setActionResumeId(resume.id);
      setPageError(null);
      setSuccessMessage(null);

      await setActiveResume(resume.id);

      setSuccessMessage("Resume marked as active successfully.");
      await loadResumeData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to set active resume."));
    } finally {
      setActionResumeId(null);
    }
  }

  async function handleDownload(resume: ResumeVersion) {
    try {
      setDownloadingResumeId(resume.id);
      setPageError(null);

      await downloadResumeFile(resume.id, resume.originalFileName);
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to download resume."));
    } finally {
      setDownloadingResumeId(null);
    }
  }

  async function handleDelete(resume: ResumeVersion) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume version? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionResumeId(resume.id);
      setPageError(null);
      setSuccessMessage(null);

      await deleteResume(resume.id);

      setSuccessMessage("Resume deleted successfully.");
      await loadResumeData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to delete resume."));
    } finally {
      setActionResumeId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading resumes...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pageError ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {pageError}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                <Star size={21} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Active Resume
                </h2>
                <p className="text-sm text-slate-500">
                  This resume will be used as the default version for future
                  resume intelligence workflows.
                </p>
              </div>
            </div>

            {activeResume ? (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <Badge variant="green">Active</Badge>

                    <h3 className="mt-4 break-words text-xl font-semibold text-white">
                      {getResumeDisplayName(activeResume)}
                    </h3>

                    <p className="mt-2 break-words text-sm text-slate-300">
                      {activeResume.originalFileName}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span>{getFileTypeLabel(activeResume.contentType)}</span>
                      <span>·</span>
                      <span>{formatFileSize(activeResume.fileSizeBytes)}</span>
                      <span>·</span>
                      <span>Uploaded {formatDate(activeResume.uploadedAt)}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={downloadingResumeId === activeResume.id}
                    onClick={() => handleDownload(activeResume)}
                  >
                    {downloadingResumeId === activeResume.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
                <p>
                  No active resume selected. Upload or activate a resume to use
                  it for future resume intelligence.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                <FileText size={21} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Resume Versions
                </h2>
                <p className="text-sm text-slate-500">
                  Manage versions for different roles, companies, and
                  application strategies.
                </p>
              </div>
            </div>

            {resumes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                  <Upload size={22} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-white">
                  No resumes uploaded yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Upload your first resume to start building your resume
                  intelligence profile.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => {
                  const isRowActionLoading = actionResumeId === resume.id;
                  const isDownloading = downloadingResumeId === resume.id;

                  return (
                    <article
                      key={resume.id}
                      className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {resume.active ? (
                              <Badge variant="green">Active</Badge>
                            ) : (
                              <Badge variant="slate">Inactive</Badge>
                            )}

                            <Badge variant="blue">
                              {getFileTypeLabel(resume.contentType)}
                            </Badge>
                          </div>

                          <h3 className="mt-4 break-words text-base font-semibold text-white">
                            {getResumeDisplayName(resume)}
                          </h3>

                          <p className="mt-2 break-words text-sm text-slate-400">
                            {resume.originalFileName}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>{formatFileSize(resume.fileSizeBytes)}</span>
                            <span>·</span>
                            <span>Uploaded {formatDate(resume.uploadedAt)}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {!resume.active ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              disabled={isRowActionLoading}
                              onClick={() => handleSetActive(resume)}
                            >
                              {isRowActionLoading ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={15} />
                              )}
                              Set Active
                            </Button>
                          ) : null}

                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={isDownloading}
                            onClick={() => handleDownload(resume)}
                          >
                            {isDownloading ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Download size={15} />
                            )}
                            Download
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={isRowActionLoading}
                            onClick={() => handleDelete(resume)}
                          >
                            {isRowActionLoading ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
              <Upload size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Upload Resume
              </h2>
              <p className="text-sm text-slate-500">
                PDF, DOC, or DOCX up to 5 MB.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Version label
              </label>

              <Input
                value={versionLabel}
                onChange={(event) => setVersionLabel(event.target.value)}
                placeholder="Backend Engineer Resume v1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Resume file
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 px-4 py-8 text-center transition hover:border-brand-500/50 hover:bg-slate-900">
                <Upload size={24} className="text-brand-300" />

                <span className="mt-3 text-sm font-medium text-white">
                  {selectedFile ? selectedFile.name : "Choose resume file"}
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  PDF, DOC, DOCX · Max 5 MB
                </span>

                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) =>
                    handleFileChange(event.target.files?.[0] ?? null)
                  }
                />
              </label>

              {uploadError ? (
                <p className="text-sm text-red-300">{uploadError}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Resume
                </>
              )}
            </Button>
          </form>
        </aside>
      </section>
    </div>
  );
}