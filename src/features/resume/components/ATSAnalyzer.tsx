import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  FileSearch,
  Loader2,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  getApiErrorCode,
  getApiErrorMessage,
} from "../../../services/apiError";
import { getJobDescriptionAnalyses } from "../services/jdAnalyzerService";
import { getResumes } from "../services/resumeService";
import { getTailoredResumes } from "../services/tailoredResumeService";
import {
  analyzeExternalResumeForAts,
  analyzeSavedResumeForAts,
  deleteAtsAnalysis,
  getAtsAnalyses,
  getAtsAnalysisById,
} from "../services/atsAnalyzerService";
import type { JobDescriptionListItem } from "../types/jdAnalyzer.types";
import type { ResumeVersion } from "../types/resume.types";
import type { TailoredResumeListItem } from "../types/tailoredResume.types";
import type {
  AtsAnalysis,
  AtsAnalysisListItem,
  AtsMatchType,
  AtsReadinessLevel,
  AtsRecommendationPriority,
  AtsSectionStatus,
  ResumeSourceType,
} from "../types/atsAnalyzer.types";

type BadgeVariant = "blue" | "green" | "amber" | "red" | "violet" | "slate";

const loadingMessages = [
  "Reading resume...",
  "Loading job description intelligence...",
  "Matching required skills...",
  "Checking keyword coverage...",
  "Calculating ATS compatibility...",
  "Preparing recommendations...",
];

const sourceOptions: Array<{
  value: ResumeSourceType;
  label: string;
  description: string;
}> = [
  {
    value: "MASTER_RESUME",
    label: "My Resumes",
    description: "Analyze one of your uploaded resume versions.",
  },
  {
    value: "TAILORED_RESUME",
    label: "Tailored Resumes",
    description: "Analyze an OfferPilot-generated tailored resume.",
  },
  {
    value: "EXTERNAL_UPLOAD",
    label: "Upload External",
    description: "Upload a PDF or DOCX only for temporary ATS analysis.",
  },
];

const scoreBreakdownLabels: Record<string, string> = {
  requiredSkillsScore: "Required Skills",
  preferredSkillsScore: "Preferred Skills",
  keywordScore: "Keywords",
  experienceScore: "Experience",
  responsibilityScore: "Responsibilities",
  educationScore: "Education",
  structureScore: "Resume Structure",
  formattingScore: "ATS Formatting",
};

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

function getTailoredResumeDisplayName(resume: TailoredResumeListItem) {
  return (
    resume.displayName ||
    resume.jobDescriptionName ||
    `${resume.targetCompany ?? "Target Company"} - ${
      resume.targetJobTitle ?? "Tailored Resume"
    }`
  );
}

function getReadinessBadgeVariant(level: AtsReadinessLevel): BadgeVariant {
  if (level === "STRONG") {
    return "green";
  }

  if (level === "MODERATE") {
    return "amber";
  }

  return "red";
}

function getMatchBadgeVariant(matchType: AtsMatchType): BadgeVariant {
  if (matchType === "MATCHED") {
    return "green";
  }

  if (matchType === "PARTIALLY_MATCHED") {
    return "amber";
  }

  return "red";
}

function getSectionStatusBadgeVariant(status: AtsSectionStatus): BadgeVariant {
  if (status === "GOOD") {
    return "green";
  }

  if (status === "NEEDS_IMPROVEMENT") {
    return "amber";
  }

  return "red";
}

function getRecommendationBadgeVariant(
  priority: AtsRecommendationPriority
): BadgeVariant {
  if (priority === "CRITICAL") {
    return "red";
  }

  if (priority === "HIGH") {
    return "amber";
  }

  if (priority === "MEDIUM") {
    return "blue";
  }

  return "slate";
}

function getSourceLabel(sourceType: ResumeSourceType) {
  if (sourceType === "MASTER_RESUME") {
    return "Master Resume";
  }

  if (sourceType === "TAILORED_RESUME") {
    return "Tailored Resume";
  }

  return "External Upload";
}

function isAllowedExternalFile(file: File) {
  const fileName = file.name.toLowerCase();

  return (
    file.type === "application/pdf" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".pdf") ||
    fileName.endsWith(".docx")
  );
}

function ScoreDashboard({ analysis }: { analysis: AtsAnalysis }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getReadinessBadgeVariant(analysis.readinessLevel)}>
              {analysis.readinessLevel}
            </Badge>

            <Badge variant="blue">{getSourceLabel(analysis.resumeSourceType)}</Badge>
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
            ATS Compatibility
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Resume-JD match analysis for{" "}
            <span className="text-slate-200">
              {analysis.companyName ?? "selected company"}
            </span>{" "}
            {analysis.jobTitle ? `— ${analysis.jobTitle}` : ""}
          </p>
        </div>

        <div className="rounded-3xl border border-brand-500/20 bg-brand-500/10 px-7 py-6 text-center">
          <p className="text-sm text-brand-200">Compatibility</p>
          <p className="mt-2 text-5xl font-semibold text-white">
            {analysis.overallScore}
          </p>
          <p className="mt-1 text-sm text-slate-400">/ 100</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200">
        This is a Resume-JD compatibility analysis, not a hiring probability or
        guaranteed ATS pass.
      </div>
    </section>
  );
}

function ScoreBreakdown({ analysis }: { analysis: AtsAnalysis }) {
  const entries = Object.entries(analysis.scoreBreakdown ?? {}).filter(
    ([, value]) => typeof value === "number"
  );

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <h2 className="text-lg font-semibold text-white">Score Breakdown</h2>
      <p className="mt-1 text-sm text-slate-500">
        Why the compatibility score looks the way it does.
      </p>

      {entries.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
          No score breakdown returned.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">
                  {scoreBreakdownLabels[key] ?? key}
                </p>
                <p className="text-sm font-semibold text-slate-300">
                  {value} / 100
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500"
                  style={{
                    width: `${value}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SkillMatchSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{
    skill: string;
    matchType: AtsMatchType;
    category: string | null;
    evidence: string | null;
  }>;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      {items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
          No items returned.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={`${title}-${item.skill}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-white">{item.skill}</p>

                <Badge variant={getMatchBadgeVariant(item.matchType)}>
                  {item.matchType === "MATCHED"
                    ? "Matched"
                    : item.matchType === "PARTIALLY_MATCHED"
                      ? "Partially Matched"
                      : "Missing"}
                </Badge>

                {item.category ? (
                  <Badge variant="slate">{item.category}</Badge>
                ) : null}
              </div>

              {item.evidence ? (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.evidence}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function KeywordSection({ analysis }: { analysis: AtsAnalysis }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <h2 className="text-lg font-semibold text-white">Keyword Coverage</h2>
      <p className="mt-1 text-sm text-slate-500">
        Matched and missing JD keywords grouped as chips.
      </p>

      {analysis.keywordMatches.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
          No keyword matches returned.
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2">
          {analysis.keywordMatches.map((keyword) => (
            <Badge
              key={`${keyword.keyword}-${keyword.matchType}`}
              variant={getMatchBadgeVariant(keyword.matchType)}
            >
              {keyword.keyword}
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}

function SectionAnalysis({ analysis }: { analysis: AtsAnalysis }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <h2 className="text-lg font-semibold text-white">Section Analysis</h2>
      <p className="mt-1 text-sm text-slate-500">
        Checks resume sections such as contact, summary, skills, experience,
        projects and education.
      </p>

      {analysis.sectionAnalysis.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
          No section analysis returned.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {analysis.sectionAnalysis.map((section) => (
            <div
              key={section.sectionName}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-white">{section.sectionName}</p>
                <Badge variant={getSectionStatusBadgeVariant(section.status)}>
                  {section.status === "GOOD"
                    ? "Good"
                    : section.status === "NEEDS_IMPROVEMENT"
                      ? "Needs Improvement"
                      : "Missing"}
                </Badge>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {section.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Recommendations({ analysis }: { analysis: AtsAnalysis }) {
  const sortedRecommendations = [...analysis.recommendations].sort((a, b) => {
    const priorityOrder = {
      CRITICAL: 0,
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
    };

    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <h2 className="text-lg font-semibold text-white">Recommendations</h2>
      <p className="mt-1 text-sm text-slate-500">
        Actionable improvements without encouraging unsupported claims.
      </p>

      {sortedRecommendations.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
          No recommendations returned.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {sortedRecommendations.map((recommendation) => (
            <div
              key={`${recommendation.priority}-${recommendation.title}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <Badge
                variant={getRecommendationBadgeVariant(
                  recommendation.priority
                )}
              >
                {recommendation.priority}
              </Badge>

              <h3 className="mt-3 font-semibold text-white">
                {recommendation.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {recommendation.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AtsResult({ analysis }: { analysis: AtsAnalysis }) {
  return (
    <div className="space-y-6">
      <ScoreDashboard analysis={analysis} />

      <ScoreBreakdown analysis={analysis} />

<div className="space-y-6">
  <SkillMatchSection
    title="Required Skill Matches"
    description="Required JD skills have the highest importance in the compatibility analysis."
    items={analysis.requiredSkillMatches}
  />

  <SkillMatchSection
    title="Preferred Skill Matches"
    description="Preferred skills are useful alignment signals but should not be merged with required skills."
    items={analysis.preferredSkillMatches}
  />
</div>

      <KeywordSection analysis={analysis} />

      <SectionAnalysis analysis={analysis} />

      <Recommendations analysis={analysis} />
    </div>
  );
}

export function ATSAnalyzer() {
  const [sourceType, setSourceType] =
    useState<ResumeSourceType>("MASTER_RESUME");

  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [tailoredResumes, setTailoredResumes] = useState<
    TailoredResumeListItem[]
  >([]);
  const [jobDescriptions, setJobDescriptions] = useState<
    JobDescriptionListItem[]
  >([]);
  const [history, setHistory] = useState<AtsAnalysisListItem[]>([]);

  const [selectedResumeId, setSelectedResumeId] = useState<number | "">("");
  const [selectedTailoredResumeId, setSelectedTailoredResumeId] = useState<
    number | ""
  >("");
  const [selectedJobDescriptionId, setSelectedJobDescriptionId] = useState<
    number | ""
  >("");
  const [externalFile, setExternalFile] = useState<File | null>(null);

  const [selectedAnalysis, setSelectedAnalysis] = useState<AtsAnalysis | null>(
    null
  );

  const [isLoadingSetup, setIsLoadingSetup] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [pageError, setPageError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedTailoredResume = useMemo(() => {
    if (selectedTailoredResumeId === "") {
      return null;
    }

    return (
      tailoredResumes.find((resume) => resume.id === selectedTailoredResumeId) ??
      null
    );
  }, [tailoredResumes, selectedTailoredResumeId]);

  const canAnalyze =
    !isAnalyzing &&
    ((sourceType === "MASTER_RESUME" &&
      selectedResumeId !== "" &&
      selectedJobDescriptionId !== "") ||
      (sourceType === "TAILORED_RESUME" && selectedTailoredResumeId !== "") ||
      (sourceType === "EXTERNAL_UPLOAD" &&
        externalFile !== null &&
        selectedJobDescriptionId !== ""));

  async function loadSetupData() {
    try {
      setPageError(null);

      const [resumeResult, tailoredResult, jdResult, historyResult] =
        await Promise.all([
          getResumes(),
          getTailoredResumes(),
          getJobDescriptionAnalyses(),
          getAtsAnalyses(),
        ]);

      setResumes(resumeResult);
      setTailoredResumes(tailoredResult);
      setJobDescriptions(jdResult);
      setHistory(historyResult);

      const activeResume = resumeResult.find((resume) => resume.active);

      if (activeResume && selectedResumeId === "") {
        setSelectedResumeId(activeResume.id);
      }
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to load ATS setup data."));
    }
  }

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
  }, []);

  useEffect(() => {
    if (!isAnalyzing) {
      setLoadingStep(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setLoadingStep((currentStep) => {
        if (currentStep >= loadingMessages.length - 1) {
          return currentStep;
        }

        return currentStep + 1;
      });
    }, 1200);

    return () => window.clearInterval(intervalId);
  }, [isAnalyzing]);

  useEffect(() => {
    if (sourceType === "TAILORED_RESUME" && selectedTailoredResume) {
      setSelectedJobDescriptionId(selectedTailoredResume.jobDescriptionId);
    }
  }, [sourceType, selectedTailoredResume]);

  function handleExternalFileChange(file: File | null) {
    setFileError(null);
    setExternalFile(null);

    if (!file) {
      return;
    }

    if (!isAllowedExternalFile(file)) {
      setFileError("Only PDF and DOCX files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("Resume file size must not exceed 5 MB.");
      return;
    }

    setExternalFile(file);
  }

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canAnalyze) {
      setPageError("Please complete the required selections before analyzing.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setPageError(null);
      setSuccessMessage(null);

      let result: AtsAnalysis;

      if (sourceType === "MASTER_RESUME") {
        result = await analyzeSavedResumeForAts({
          resumeSourceType: "MASTER_RESUME",
          resumeId: selectedResumeId as number,
          jobDescriptionId: selectedJobDescriptionId as number,
        });
      } else if (sourceType === "TAILORED_RESUME") {
        result = await analyzeSavedResumeForAts({
          resumeSourceType: "TAILORED_RESUME",
          tailoredResumeId: selectedTailoredResumeId as number,
        });
      } else {
        result = await analyzeExternalResumeForAts({
          file: externalFile as File,
          jobDescriptionId: selectedJobDescriptionId as number,
        });
      }

      setSelectedAnalysis(result);
      setSuccessMessage("ATS analysis completed successfully.");
      await loadSetupData();
    } catch (error) {
      const errorCode = getApiErrorCode(error);

      if (errorCode === "RESOURCE_NOT_FOUND") {
        setPageError("Selected resume or job description was not found.");
      } else {
        setPageError(getApiErrorMessage(error, "Unable to run ATS analysis."));
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleOpenAnalysis(analysisId: number) {
    try {
      setIsLoadingDetail(true);
      setPageError(null);

      const result = await getAtsAnalysisById(analysisId);

      setSelectedAnalysis(result);
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to load ATS analysis."));
    } finally {
      setIsLoadingDetail(false);
    }
  }

  async function handleDeleteAnalysis(item: AtsAnalysisListItem) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ATS analysis? This will not delete your resume or job description."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);
      setPageError(null);
      setSuccessMessage(null);

      await deleteAtsAnalysis(item.id);

      if (selectedAnalysis?.id === item.id) {
        setSelectedAnalysis(null);
      }

      setSuccessMessage("ATS analysis deleted successfully.");
      await loadSetupData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to delete ATS analysis."));
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoadingSetup) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 size={18} className="animate-spin" />
          Loading ATS Analyzer...
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
            <FileSearch size={21} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">ATS Analyzer</h2>
            <p className="text-sm text-slate-500">
              Analyze how well a resume aligns with a selected job description.
            </p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            {sourceOptions.map((option) => {
              const isActive = sourceType === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSourceType(option.value)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-brand-500/50 bg-brand-500/15 text-white"
                      : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          {sourceType === "MASTER_RESUME" ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Select resume
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
              </div>
            </div>
          ) : null}

          {sourceType === "TAILORED_RESUME" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Select tailored resume
              </label>

              <select
                value={selectedTailoredResumeId}
                onChange={(event) =>
                  setSelectedTailoredResumeId(
                    event.target.value ? Number(event.target.value) : ""
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-brand-500"
              >
                <option value="">Select tailored resume</option>
                {tailoredResumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {getTailoredResumeDisplayName(resume)}
                  </option>
                ))}
              </select>

              {selectedTailoredResume ? (
                <p className="text-xs text-slate-500">
                  JD is linked automatically:{" "}
                  {selectedTailoredResume.jobDescriptionName ?? "Selected JD"}
                </p>
              ) : null}
            </div>
          ) : null}

          {sourceType === "EXTERNAL_UPLOAD" ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Upload external resume
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 px-4 py-8 text-center transition hover:border-brand-500/50 hover:bg-slate-900">
                  <Upload size={24} className="text-brand-300" />

                  <span className="mt-3 text-sm font-medium text-white">
                    {externalFile ? externalFile.name : "Choose PDF or DOCX"}
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    PDF, DOCX · Max 5 MB
                  </span>

                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) =>
                      handleExternalFileChange(event.target.files?.[0] ?? null)
                    }
                  />
                </label>

                {fileError ? (
                  <p className="text-sm text-red-300">{fileError}</p>
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
              </div>
            </div>
          ) : null}

          {isAnalyzing ? (
            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4">
              <div className="flex items-center gap-3 text-sm text-brand-200">
                <Loader2 size={17} className="animate-spin" />
                {loadingMessages[loadingStep]}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-500">
              This analyzer explains alignment. It does not guarantee ATS
              passing, interviews or selection.
            </p>

            <Button type="submit" disabled={!canAnalyze}>
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Analyze ATS Compatibility
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <h2 className="text-lg font-semibold text-white">ATS History</h2>
          <p className="mt-1 text-sm text-slate-500">
            Saved resume-JD analyses.
          </p>

          {history.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
              No ATS analyses yet. Analyze a resume against a job description to
              get started.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {history.map((item) => {
                const isSelected = selectedAnalysis?.id === item.id;
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
                      onClick={() => handleOpenAnalysis(item.id)}
                      className="block w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-semibold text-white">
                            {item.companyName ?? "Company"} —{" "}
                            {item.jobTitle ?? "Role"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {getSourceLabel(item.resumeSourceType)} ·{" "}
                            {formatDate(item.createdAt)}
                          </p>
                        </div>

                        <Badge variant={getReadinessBadgeVariant(item.readinessLevel)}>
                          {item.overallScore}/100
                        </Badge>
                      </div>
                    </button>

                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="mt-3"
                      disabled={isDeleting}
                      onClick={() => handleDeleteAnalysis(item)}
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
                Loading ATS analysis...
              </div>
            </div>
          ) : selectedAnalysis ? (
            <AtsResult analysis={selectedAnalysis} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
              <BarChart3 size={26} className="mx-auto text-brand-300" />

              <h3 className="mt-4 text-base font-semibold text-white">
                No ATS analysis selected
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Analyze a resume or open a saved analysis to view score,
                breakdown, matches and recommendations.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}