import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  BrainCircuit,
  Download,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { getApiErrorCode, getApiErrorMessage } from "../../../services/apiError";
import { getJobDescriptionAnalyses } from "../services/jdAnalyzerService";
import { getResumes } from "../services/resumeService";
import {
  deleteTailoredResume,
  downloadTailoredResumeLatex,
  generateTailoredResume,
  getTailoredResumeById,
  getTailoredResumes,
  renderTailoredResumeLatex,
} from "../services/tailoredResumeService";
import type { JobDescriptionListItem } from "../types/jdAnalyzer.types";
import type { ResumeVersion } from "../types/resume.types";
import type {
  SkillMatch,
  TailoredResume,
  TailoredResumeListItem,
  TailoredResumeStatus,
} from "../types/tailoredResume.types";
import { TailoredResumePreviewModal } from "./TailoredResumePreviewModal";

type BadgeVariant = "blue" | "green" | "amber" | "red" | "violet" | "slate";

const loadingMessages = [
  "Reading your master resume...",
  "Loading job description intelligence...",
  "Matching skills and requirements...",
  "Rewriting relevant experience...",
  "Preparing tailored resume draft...",
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

function getResumeDisplayName(resume: ResumeVersion) {
  return resume.versionLabel || resume.originalFileName;
}

function getJdDisplayName(jd: JobDescriptionListItem) {
  if (jd.displayName) {
    return jd.displayName;
  }

  if (jd.companyName && jd.jobTitle) {
    return `${jd.companyName} - ${jd.jobTitle}`;
  }

  return jd.jobTitle || jd.companyName || "Untitled JD";
}

function getTailoredResumeDisplayName(
  tailoredResume: TailoredResume | TailoredResumeListItem
) {
  return (
    tailoredResume.displayName ||
    tailoredResume.jobDescriptionName ||
    `${tailoredResume.targetCompany ?? "Target Company"} - ${
      tailoredResume.targetJobTitle ?? "Tailored Resume"
    }`
  );
}

function FitSummary({
  matchedCount,
  partiallyMatchedCount,
  missingCount,
}: {
  matchedCount: number;
  partiallyMatchedCount: number;
  missingCount: number;
}) {
  const fitState =
    missingCount === 0
      ? "STRONG"
      : missingCount < matchedCount
        ? "MODERATE"
        : "WEAK";

  const config = {
    STRONG: {
      label: "Strong Fit",
      badge: "green" as BadgeVariant,
      title: "Strong fit based on your master resume.",
      description:
        "Your master resume supports the key skills found in this job description.",
      boxClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
    },
    MODERATE: {
      label: "Moderate Fit",
      badge: "amber" as BadgeVariant,
      title: "Good match with some missing JD requirements.",
      description:
        "Your resume matches several JD skills, but some requirements are missing or only partially supported.",
      boxClass: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    },
    WEAK: {
      label: "Fit Warning",
      badge: "red" as BadgeVariant,
      title: "This role may require skills not strongly supported by your master resume.",
      description:
        "OfferPilot did not add unsupported skills to your tailored resume. Review missing skills before applying.",
      boxClass: "border-red-500/20 bg-red-500/10 text-red-200",
    },
  }[fitState];

  return (
    <section className={`rounded-3xl border p-5 shadow-premium ${config.boxClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge variant={config.badge}>{config.label}</Badge>

          <h3 className="mt-4 text-base font-semibold text-white">
            {config.title}
          </h3>

          <p className="mt-2 text-sm leading-6">
            {config.description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">Matched</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-300">
            {matchedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">Partial</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">
            {partiallyMatchedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">Missing</p>
          <p className="mt-1 text-2xl font-semibold text-red-300">
            {missingCount}
          </p>
        </div>
      </div>
    </section>
  );
}

function getStatusBadgeVariant(status: TailoredResumeStatus): BadgeVariant {
  if (status === "GENERATED") {
    return "green";
  }

  if (status === "FAILED") {
    return "red";
  }

  return "slate";
}

function getSkillMatchBadgeVariant(matchType: string): BadgeVariant {
  if (matchType === "MATCHED") {
    return "green";
  }

  if (matchType === "PARTIALLY_MATCHED") {
    return "amber";
  }

  return "red";
}

function emptyToUndefined(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-5">{children}</div>
    </section>
    
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
        <Sparkles size={22} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

function BulletList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
        {emptyText}
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SkillMatchList({
  title,
  description,
  skills,
  emptyText,
}: {
  title: string;
  description: string;
  skills: SkillMatch[];
  emptyText: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      {skills.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
          {emptyText}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {skills.map((skill) => (
            <div
              key={`${skill.matchType}-${skill.skill}`}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-white">{skill.skill}</p>

                <Badge variant={getSkillMatchBadgeVariant(skill.matchType)}>
                  {skill.matchType === "MATCHED"
                    ? "Matched"
                    : skill.matchType === "PARTIALLY_MATCHED"
                      ? "Partially matched"
                      : "Missing"}
                </Badge>
              </div>

              {skill.evidence ? (
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {skill.evidence}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



function TailoredResumePreview({
  tailoredResume,
  onRenderLatex,
  onDownloadLatex,
  onPreviewResume,
  isRenderingLatex,
  isDownloadingLatex,
}: {
  tailoredResume: TailoredResume | null;
  onRenderLatex: () => void;
  onDownloadLatex: () => void;
  onPreviewResume: () => void;
  isRenderingLatex: boolean;
  isDownloadingLatex: boolean;
}) {
  if (!tailoredResume) {
    return (
      <EmptyState
        title="No tailored resume selected"
        description="Select a saved tailored resume or generate a new draft to preview structured content."
      />
    );
  }

  const structuredContent = tailoredResume.structuredContent;

  if (!structuredContent) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center shadow-premium">
        <AlertCircle className="mx-auto text-red-300" size={26} />
        <h2 className="mt-4 text-xl font-semibold text-white">
          Preview unavailable
        </h2>
        <p className="mt-2 text-sm text-red-200">
          Structured resume content is not available for this record.
        </p>
      </div>
    );
  }

  const notes = [
    ...(tailoredResume.tailoringNotes ?? []),
    ...(structuredContent.tailoringNotes ?? []),
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getStatusBadgeVariant(tailoredResume.status)}>
                {tailoredResume.status === "GENERATED"
                  ? "Generated"
                  : tailoredResume.status === "FAILED"
                    ? "Failed"
                    : "Draft"}
              </Badge>

              <Badge variant="amber">AI-generated draft</Badge>

              {tailoredResume.hasLatex ? (
                <Badge variant="green">LaTeX ready</Badge>
              ) : (
                <Badge variant="slate">No LaTeX yet</Badge>
              )}
            </div>

            <h2 className="mt-4 break-words text-2xl font-semibold tracking-tight text-white">
              {getTailoredResumeDisplayName(tailoredResume)}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              AI-generated draft. Please review before applying.
            </p>

            <div className="mt-4 grid gap-3 text-sm text-slate-400 md:grid-cols-2">
              <p>
                Company:{" "}
                <span className="text-slate-200">
                  {tailoredResume.targetCompany ?? "Not specified"}
                </span>
              </p>

              <p>
                Role:{" "}
                <span className="text-slate-200">
                  {tailoredResume.targetJobTitle ?? "Not specified"}
                </span>
              </p>

              <p>
                Source Resume:{" "}
                <span className="text-slate-200">
                  {tailoredResume.sourceResumeName ??
                    tailoredResume.sourceResumeOriginalFileName ??
                    "Not specified"}
                </span>
              </p>

              <p>
                Created:{" "}
                <span className="text-slate-200">
                  {formatDate(tailoredResume.createdAt)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isRenderingLatex}
              onClick={onRenderLatex}
            >
              {isRenderingLatex ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )}
              Render LaTeX
            </Button>
            <Button
  type="button"
  onClick={onPreviewResume}
>
  Preview Resume
</Button>

            <Button
              type="button"
              variant="secondary"
              disabled={!tailoredResume.hasLatex || isDownloadingLatex}
              onClick={onDownloadLatex}
            >
              {isDownloadingLatex ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Download LaTeX
            </Button>

            <Button type="button" variant="secondary" disabled>
              Download PDF
            </Button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200">
          PDF export coming soon. LaTeX generation and `.tex` download are
          available now.
        </div>
      </section>
      <FitSummary
  matchedCount={tailoredResume.matchedSkills?.length ?? 0}
  partiallyMatchedCount={tailoredResume.partiallyMatchedSkills?.length ?? 0}
  missingCount={tailoredResume.missingSkills?.length ?? 0}
/>

      <section className="min-w-0 space-y-6">

  <SkillMatchList
    title="Matched Skills"
    description="JD skills supported by your master resume."
    skills={tailoredResume.matchedSkills ?? []}
    emptyText="No matched skills found."
  />

  <SkillMatchList
    title="Partially Matched"
    description="Related skills or experience found in your resume."
    skills={tailoredResume.partiallyMatchedSkills ?? []}
    emptyText="No partially matched skills found."
  />

<SkillMatchList
  title="Missing Skills"
  description="These JD skills were not found in your master resume. OfferPilot did not add them to avoid unsupported claims."
  skills={tailoredResume.missingSkills ?? []}
  emptyText="No missing JD skills detected."
/>

<SectionCard
  title="Tailoring Notes"
  description="What OfferPilot changed or intentionally avoided."
>
  <BulletList
    items={notes}
    emptyText="No additional tailoring notes."
  />
</SectionCard>
</section>
    </div>
  );
}

export function TailorResume() {
  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<
    JobDescriptionListItem[]
  >([]);
  const [tailoredResumes, setTailoredResumes] = useState<
    TailoredResumeListItem[]
  >([]);

  const [selectedResumeId, setSelectedResumeId] = useState<number | "">("");
  const [selectedJobDescriptionId, setSelectedJobDescriptionId] = useState<
    number | ""
  >("");
  const [displayName, setDisplayName] = useState("");

  const [selectedTailoredResume, setSelectedTailoredResume] =
    useState<TailoredResume | null>(null);

  const [isLoadingSetup, setIsLoadingSetup] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isRenderingLatex, setIsRenderingLatex] = useState(false);
  const [isDownloadingLatex, setIsDownloadingLatex] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canGenerate =
    selectedResumeId !== "" && selectedJobDescriptionId !== "" && !isGenerating;

  const hasSetupIssue = resumes.length === 0 || jobDescriptions.length === 0;

  const selectedResume = useMemo(() => {
    if (selectedResumeId === "") {
      return null;
    }

    return resumes.find((resume) => resume.id === selectedResumeId) ?? null;
  }, [resumes, selectedResumeId]);

  const selectedJobDescription = useMemo(() => {
    if (selectedJobDescriptionId === "") {
      return null;
    }

    return (
      jobDescriptions.find((jd) => jd.id === selectedJobDescriptionId) ?? null
    );
  }, [jobDescriptions, selectedJobDescriptionId]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const loadSetupData = useCallback(async () => {
    try {
      setPageError(null);

      const [resumeResult, jdResult, tailoredResult] = await Promise.all([
        getResumes(),
        getJobDescriptionAnalyses(),
        getTailoredResumes(),
      ]);

      setResumes(resumeResult);
      setJobDescriptions(jdResult);
      setTailoredResumes(tailoredResult);

      const activeResume = resumeResult.find((resume) => resume.active);
      if (activeResume) {
        setSelectedResumeId(activeResume.id);
      }
    } catch (error) {
      setPageError(
        getApiErrorMessage(error, "Unable to load tailor resume setup data.")
      );
    }
  }, []);

  useEffect(() => {
    async function initialLoad() {
      try {
        setIsLoadingSetup(true);
        await loadSetupData();
      } finally {
        setIsLoadingSetup(false);
      }
    }

    initialLoad();
  }, [loadSetupData]);

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setLoadingStep((currentStep) => {
        if (currentStep >= loadingMessages.length - 1) {
          return currentStep;
        }

        return currentStep + 1;
      });
    }, 1400);

    return () => window.clearInterval(intervalId);
  }, [isGenerating]);

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canGenerate) {
      setPageError("Please select both a resume and an analyzed JD.");
      return;
    }

    try {
      setLoadingStep(0);
      setIsGenerating(true);
      setPageError(null);
      setSuccessMessage(null);

      const result = await generateTailoredResume({
        resumeId: selectedResumeId as number,
        jobDescriptionId: selectedJobDescriptionId as number,
        displayName: emptyToUndefined(displayName),
        templateName: "PROFESSIONAL_DEFAULT",
      });

      setSelectedTailoredResume(result);
      setSuccessMessage("Tailored resume draft generated successfully.");
      await loadSetupData();
    } catch (error) {
      const errorCode = getApiErrorCode(error);

      if (errorCode === "RESOURCE_NOT_FOUND") {
        setPageError(
          "Selected resume or job description could not be found. Please choose another option."
        );
      } else if (errorCode === "JD_ANALYSIS_FAILED") {
        setPageError(
          "We could not tailor your resume right now. Please try again."
        );
      } else {
        setPageError(
          getApiErrorMessage(error, "Unable to generate tailored resume.")
        );
      }
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleOpenTailoredResume(tailoredResumeId: number) {
    try {
      setIsLoadingDetail(true);
      setPageError(null);

      const result = await getTailoredResumeById(tailoredResumeId);

      setSelectedTailoredResume(result);
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to load tailored resume."));
    } finally {
      setIsLoadingDetail(false);
    }
  }

  async function handleRenderLatex() {
    if (!selectedTailoredResume) {
      return;
    }

    try {
      setIsRenderingLatex(true);
      setPageError(null);
      setSuccessMessage(null);

      const result = await renderTailoredResumeLatex(selectedTailoredResume.id);

      setSelectedTailoredResume(result);
      setSuccessMessage("LaTeX rendered successfully.");
      await loadSetupData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to render LaTeX."));
    } finally {
      setIsRenderingLatex(false);
    }
  }

  async function handleDownloadLatex() {
    if (!selectedTailoredResume) {
      return;
    }

    try {
      setIsDownloadingLatex(true);
      setPageError(null);

      await downloadTailoredResumeLatex(
        selectedTailoredResume.id,
        `${getTailoredResumeDisplayName(selectedTailoredResume)}.tex`
      );
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to download LaTeX."));
    } finally {
      setIsDownloadingLatex(false);
    }
  }

  async function handleDeleteTailoredResume(item: TailoredResumeListItem) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tailored resume? This will not delete your master resume."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);
      setPageError(null);
      setSuccessMessage(null);

      await deleteTailoredResume(item.id);

      if (selectedTailoredResume?.id === item.id) {
        setSelectedTailoredResume(null);
      }

      setSuccessMessage("Tailored resume deleted successfully.");
      await loadSetupData();
    } catch (error) {
      setPageError(
        getApiErrorMessage(error, "Unable to delete tailored resume.")
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoadingSetup) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 size={18} className="animate-spin" />
          Loading Tailor Resume...
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

      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
            <BrainCircuit size={21} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Tailor Resume</h2>
            <p className="text-sm text-slate-500">
              Generate a role-specific resume draft using your uploaded resume
              and an analyzed job description.
            </p>
          </div>
        </div>

        {hasSetupIssue ? (
          <div className="grid gap-4 md:grid-cols-2">
            {resumes.length === 0 ? (
              <EmptyState
                title="No resume uploaded yet"
                description="Upload a master resume before tailoring."
              />
            ) : null}

            {jobDescriptions.length === 0 ? (
              <EmptyState
                title="No analyzed JD yet"
                description="Analyze a job description before tailoring your resume."
              />
            ) : null}
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Select master resume
                </label>

                <select
                  value={selectedResumeId}
                  onChange={(event) =>
                    setSelectedResumeId(
                      event.target.value ? Number(event.target.value) : ""
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-brand-500"
                >
                  <option value="">Select resume</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {getResumeDisplayName(resume)}
                      {resume.active ? " · Active" : ""}
                    </option>
                  ))}
                </select>

                {selectedResume ? (
                  <p className="text-xs text-slate-500">
                    {selectedResume.originalFileName} · Uploaded{" "}
                    {formatDate(selectedResume.uploadedAt)}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Select analyzed JD
                </label>

                <select
                  value={selectedJobDescriptionId}
                  onChange={(event) =>
                    setSelectedJobDescriptionId(
                      event.target.value ? Number(event.target.value) : ""
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-brand-500"
                >
                  <option value="">Select JD</option>
                  {jobDescriptions.map((jd) => (
                    <option key={jd.id} value={jd.id}>
                      {getJdDisplayName(jd)}
                    </option>
                  ))}
                </select>

                {selectedJobDescription ? (
                  <p className="text-xs text-slate-500">
                    {(selectedJobDescription.companyName ?? "Unknown company") +
                      " · " +
                      (selectedJobDescription.jobTitle ?? "Unknown role")}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2 xl:col-span-2">
                <label className="text-sm font-medium text-slate-200">
                  Display name
                </label>

                <Input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="ABC Tech Backend Tailored Resume"
                />
              </div>
            </div>

            {isGenerating ? (
              <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4">
                <div className="flex items-center gap-3 text-sm text-brand-200">
                  <Loader2 size={17} className="animate-spin" />
                  {loadingMessages[loadingStep]}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-500">
                AI-generated draft. Please review before using it for
                applications.
              </p>

              <Button type="submit" disabled={!canGenerate}>
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Tailoring...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Tailor Resume
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <h2 className="text-lg font-semibold text-white">
            Tailored Resume History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Saved tailored resume drafts.
          </p>

          {tailoredResumes.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
              No tailored resumes yet. Select a resume and job description to
              generate your first tailored resume.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {tailoredResumes.map((item) => {
                const isSelected = selectedTailoredResume?.id === item.id;
                const isDeleting = deletingId === item.id;

                return (
                  <article
                    key={item.id}
                    className={`rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-brand-500/50 bg-brand-500/10"
                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenTailoredResume(item.id)}
                      className="block w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-semibold text-white">
                            {getTailoredResumeDisplayName(item)}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.targetCompany ?? "Company not set"} ·{" "}
                            {item.targetJobTitle ?? "Role not set"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Created {formatDate(item.createdAt)}
                          </p>
                        </div>

                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.hasLatex ? (
                          <Badge variant="green">LaTeX</Badge>
                        ) : (
                          <Badge variant="slate">No LaTeX</Badge>
                        )}

                        {item.hasPdf ? (
                          <Badge variant="green">PDF</Badge>
                        ) : (
                          <Badge variant="slate">PDF soon</Badge>
                        )}
                      </div>
                    </button>

                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="mt-3"
                      disabled={isDeleting}
                      onClick={() => handleDeleteTailoredResume(item)}
                    >
                      {isDeleting ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                      Delete
                    </Button>
                  </article>
                );
              })}
            </div>
          )}
        </aside>

        <div className="min-w-0">
          {isLoadingDetail ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/80 shadow-premium">
              <div className="flex items-center gap-3 text-slate-400">
                <Loader2 size={18} className="animate-spin" />
                Loading tailored resume...
              </div>
            </div>
          ) : (
            <TailoredResumePreview
  tailoredResume={selectedTailoredResume}
  onRenderLatex={handleRenderLatex}
  onDownloadLatex={handleDownloadLatex}
  onPreviewResume={() => setIsPreviewModalOpen(true)}
  isRenderingLatex={isRenderingLatex}
  isDownloadingLatex={isDownloadingLatex}
/>
          )}
        </div>
      </section>
      <TailoredResumePreviewModal
  open={isPreviewModalOpen}
  tailoredResume={selectedTailoredResume}
  onClose={() => setIsPreviewModalOpen(false)}
/>
    </div>
  );
}