import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  BrainCircuit,
  FileSearch,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { PageHeader } from "../../../components/common/PageHeader";
import {
  getApiErrorCode,
  getApiErrorMessage,
  getApiFieldErrors,
} from "../../../services/apiError";
import {
  analyzeJobDescription,
  deleteJobDescriptionAnalysis,
  getJobDescriptionAnalyses,
  getJobDescriptionAnalysisById,
} from "../services/jdAnalyzerService";
import type {
  AnalysisStatus,
  JdAnalysisItem,
  JobDescriptionAnalysis,
  JobDescriptionListItem,
  KeywordCategory,
  SkillPriority,
  WorkMode,
} from "../types/jdAnalyzer.types"
import { ResumeManager } from "../components/ResumeManager";
import { TailorResume } from "../components/TailorResume";
import { ATSAnalyzer } from "../components/ATSAnalyzer";

type ActiveTab = "RESUMES" | "JD_ANALYZER" | "TAILOR_RESUME" | "ATS_ANALYZER";

type JdAnalyzerFormState = {
  rawDescription: string;
  displayName: string;
  companyName: string;
  jobTitle: string;
  source: string;
};

type JdAnalyzerFormErrors = Partial<Record<keyof JdAnalyzerFormState, string>>;

type BadgeVariant = "blue" | "green" | "amber" | "red" | "violet" | "slate";

const emptyForm: JdAnalyzerFormState = {
  rawDescription: "",
  displayName: "",
  companyName: "",
  jobTitle: "",
  source: "",
};

const sourceOptions = [
  "LinkedIn",
  "Naukri",
  "Indeed",
  "Company Careers",
  "Referral",
  "Email",
  "Other",
];

const loadingMessages = [
  "Analyzing job description...",
  "Extracting required skills...",
  "Identifying preferred skills...",
  "Finding responsibilities and keywords...",
  "Structuring JD intelligence...",
];

const workModeLabels: Record<WorkMode, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "Onsite",
  NOT_SPECIFIED: "Not specified",
};

const priorityLabels: Record<SkillPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const keywordCategoryLabels: Record<KeywordCategory, string> = {
  TECHNICAL_SKILL: "Technical Skill",
  TECHNOLOGY: "Technology",
  FRAMEWORK: "Framework",
  DATABASE: "Database",
  CLOUD: "Cloud",
  TOOL: "Tool",
  DOMAIN: "Domain",
  SOFT_SKILL: "Soft Skill",
  ROLE_TERM: "Role Term",
  OTHER: "Other",
};

function emptyToUndefined(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

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

function getPriorityBadgeVariant(priority: SkillPriority | null): BadgeVariant {
  if (priority === "HIGH") {
    return "red";
  }

  if (priority === "MEDIUM") {
    return "amber";
  }

  if (priority === "LOW") {
    return "slate";
  }

  return "slate";
}

function getAnalysisStatusBadgeVariant(status: AnalysisStatus): BadgeVariant {
  if (status === "COMPLETED") {
    return "green";
  }

  return "red";
}

function getKeywordCategoryBadgeVariant(
  category: KeywordCategory | null
): BadgeVariant {
  if (category === "TECHNOLOGY" || category === "FRAMEWORK") {
    return "blue";
  }

  if (category === "DATABASE" || category === "CLOUD") {
    return "violet";
  }

  if (category === "SOFT_SKILL") {
    return "amber";
  }

  if (category === "TOOL" || category === "TECHNICAL_SKILL") {
    return "green";
  }

  return "slate";
}

function validateForm(form: JdAnalyzerFormState) {
  const errors: JdAnalyzerFormErrors = {};
  const rawDescriptionLength = form.rawDescription.trim().length;

  if (!form.rawDescription.trim()) {
    errors.rawDescription = "Job description is required.";
  } else if (rawDescriptionLength < 100 || rawDescriptionLength > 15000) {
    errors.rawDescription =
      "Job description must be between 100 and 15000 characters.";
  }

  if (form.companyName.trim().length > 150) {
    errors.companyName = "Company name must be at most 150 characters.";
  }

  if (form.jobTitle.trim().length > 150) {
    errors.jobTitle = "Job title must be at most 150 characters.";
  }

  if (form.source.trim().length > 150) {
    errors.source = "Source must be at most 150 characters.";
  }

  if (form.displayName.trim().length > 150) {
    errors.displayName = "Display name must be at most 150 characters.";
  }

  return errors;
}

function buildAnalyzePayload(form: JdAnalyzerFormState) {
  return {
    rawDescription: form.rawDescription.trim(),
    companyName: emptyToUndefined(form.companyName),
    jobTitle: emptyToUndefined(form.jobTitle),
    source: emptyToUndefined(form.source),
    displayName: emptyToUndefined(form.displayName),
  };
}

function getDisplayName(item: {
  displayName: string | null;
  companyName: string | null;
  jobTitle: string | null;
}) {
  if (item.displayName) {
    return item.displayName;
  }

  if (item.companyName && item.jobTitle) {
    return `${item.companyName} - ${item.jobTitle}`;
  }

  if (item.jobTitle) {
    return item.jobTitle;
  }

  if (item.companyName) {
    return item.companyName;
  }

  return "Untitled JD Analysis";
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
      <p className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500 sm:w-44">
        {label}
      </p>

      <p className="min-w-0 break-words text-sm font-medium leading-6 text-white sm:text-right">
        {value !== null && value !== undefined && value !== ""
          ? value
          : "Not specified"}
      </p>
    </div>
  );
}

function AnalysisItemCard({
  item,
  compact,
}: {
  item: JdAnalysisItem;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium text-white">{item.text}</p>

        {item.category ? (
          <Badge variant={getKeywordCategoryBadgeVariant(item.category)}>
            {keywordCategoryLabels[item.category]}
          </Badge>
        ) : null}

        {item.priority ? (
          <Badge variant={getPriorityBadgeVariant(item.priority)}>
            {priorityLabels[item.priority]} importance
          </Badge>
        ) : null}
      </div>

      {item.normalizedText && item.normalizedText !== item.text ? (
        <p className="mt-2 text-xs text-slate-500">
          Normalized: {item.normalizedText}
        </p>
      ) : null}

      {!compact && item.evidence ? (
        <p className="mt-3 text-sm leading-6 text-slate-400">
          <span className="text-slate-500">Evidence:</span> {item.evidence}
        </p>
      ) : null}
    </div>
  );
}

function AnalysisSection({
  title,
  description,
  items,
  emptyText,
  compact,
}: {
  title: string;
  description?: string;
  items: JdAnalysisItem[];
  emptyText: string;
  compact?: boolean;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
          {emptyText}
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <AnalysisItemCard key={item.id} item={item} compact={compact} />
          ))}
        </div>
      )}
    </section>
  );
}

function SkillPriorityMatrix({
  requiredSkills,
  preferredSkills,
}: {
  requiredSkills: JdAnalysisItem[];
  preferredSkills: JdAnalysisItem[];
}) {
  const rows = [
    ...requiredSkills.map((skill) => ({
      ...skill,
      type: "Required",
    })),
    ...preferredSkills.map((skill) => ({
      ...skill,
      type: "Preferred",
    })),
  ];

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <h2 className="text-lg font-semibold text-white">Skill Priority Matrix</h2>

      <p className="mt-1 text-sm text-slate-500">
        Required and preferred skills with JD importance and supporting evidence.
      </p>

      {rows.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
          No skills were identified strongly enough to build a matrix.
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Skill</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">JD Importance</th>
                <th className="px-3 py-2">Evidence</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={`${row.type}-${row.id}`} className="bg-slate-900/60">
                  <td className="rounded-l-2xl px-3 py-4 font-medium text-white">
                    {row.text}
                  </td>

                  <td className="px-3 py-4 text-slate-300">{row.type}</td>

                  <td className="px-3 py-4">
                    {row.category ? (
                      <Badge variant={getKeywordCategoryBadgeVariant(row.category)}>
                        {keywordCategoryLabels[row.category]}
                      </Badge>
                    ) : (
                      <span className="text-slate-500">Not specified</span>
                    )}
                  </td>

                  <td className="px-3 py-4">
                    {row.priority ? (
                      <Badge variant={getPriorityBadgeVariant(row.priority)}>
                        {priorityLabels[row.priority]}
                      </Badge>
                    ) : (
                      <span className="text-slate-500">Not specified</span>
                    )}
                  </td>

                  <td className="rounded-r-2xl px-3 py-4 text-sm leading-6 text-slate-400">
                    {row.evidence ?? "No evidence captured."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function JdAnalysisResult({
  selectedAnalysis,
}: {
  selectedAnalysis: JobDescriptionAnalysis | null;
}) {
  const analysis = selectedAnalysis?.analysis;

  if (!selectedAnalysis) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/70 p-8 text-center shadow-premium">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
          <BrainCircuit size={23} />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-white">
          No analysis selected
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Select a saved JD or analyze a new job description to view structured
          job intelligence.
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center shadow-premium">
        <AlertCircle className="mx-auto text-red-300" size={26} />
        <h2 className="mt-4 text-xl font-semibold text-white">
          Analysis unavailable
        </h2>
        <p className="mt-2 text-sm text-red-200">
          This job description analysis could not be displayed.
        </p>
      </div>
    );
  }

  const experienceRange =
    analysis.minYearsExperience || analysis.maxYearsExperience
      ? `${analysis.minYearsExperience ?? 0} - ${
          analysis.maxYearsExperience ?? "Not specified"
        } years`
      : "Not specified";

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getAnalysisStatusBadgeVariant(selectedAnalysis.analysisStatus)}>
                {selectedAnalysis.analysisStatus === "COMPLETED"
                  ? "Completed"
                  : "Failed"}
              </Badge>

              <span className="text-xs text-slate-500">
                Analyzed on {formatDate(selectedAnalysis.createdAt)}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
              {getDisplayName(selectedAnalysis)}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Structured job description intelligence report.
            </p>
          </div>
        </div>

<div className="mt-6 space-y-3">
  <DetailField
    label="Extracted Job Title"
    value={analysis.extractedJobTitle ?? selectedAnalysis.jobTitle}
  />

  <DetailField
    label="Extracted Company"
    value={analysis.extractedCompanyName ?? selectedAnalysis.companyName}
  />

  <DetailField label="Seniority" value={analysis.seniority} />

  <DetailField label="Experience" value={experienceRange} />

  <DetailField label="Employment Type" value={analysis.employmentType} />

  <DetailField label="Location" value={analysis.location} />

  <DetailField
    label="Work Mode"
    value={analysis.workMode ? workModeLabels[analysis.workMode] : null}
  />

  <DetailField label="Source" value={selectedAnalysis.source} />
</div>
      </section>

      <AnalysisSection
        title="Required Skills"
        description="Must-have skills explicitly or strongly indicated in the JD."
        items={analysis.requiredSkills}
        emptyText="No required skills were clearly identified. Try using a more detailed job description."
      />

      <AnalysisSection
        title="Preferred Skills"
        description="Good-to-have skills that can strengthen resume tailoring later."
        items={analysis.preferredSkills}
        emptyText="No preferred skills were explicitly mentioned."
      />

      <SkillPriorityMatrix
        requiredSkills={analysis.requiredSkills}
        preferredSkills={analysis.preferredSkills}
      />

      <AnalysisSection
        title="Responsibilities"
        items={analysis.responsibilities}
        emptyText="No responsibilities were clearly identified."
        compact
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <AnalysisSection
          title="Required Qualifications"
          items={analysis.requiredQualifications}
          emptyText="No required qualifications explicitly mentioned."
          compact
        />

        <AnalysisSection
          title="Preferred Qualifications"
          items={analysis.preferredQualifications}
          emptyText="No preferred qualifications explicitly mentioned."
          compact
        />
      </section>

      <AnalysisSection
        title="Soft Skills"
        items={analysis.softSkills}
        emptyText="No soft skills were explicitly identified."
        compact
      />

      <AnalysisSection
        title="Technologies and Tools"
        description="Technologies, frameworks, databases, cloud platforms, and tools from the JD."
        items={analysis.technologies}
        emptyText="No technologies or tools were clearly identified."
      />

      <AnalysisSection
        title="Keywords"
        description="Important keywords useful for future resume tailoring and ATS checks."
        items={analysis.keywords}
        emptyText="No keywords were extracted."
        compact
      />

      <AnalysisSection
        title="Important Phrases"
        items={analysis.importantPhrases}
        emptyText="No important phrases were extracted."
        compact
      />

      <details className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
        <summary className="cursor-pointer text-lg font-semibold text-white">
          Original Job Description
        </summary>

        <p className="mt-5 whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm leading-7 text-slate-300">
          {selectedAnalysis.rawDescription}
        </p>
      </details>
    </div>
  );
}

export function ResumePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("RESUMES");
  const [history, setHistory] = useState<JobDescriptionListItem[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<JobDescriptionAnalysis | null>(null);

  const [form, setForm] = useState<JdAnalyzerFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<JdAnalyzerFormErrors>({});

  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const rawDescriptionLength = useMemo(
    () => form.rawDescription.trim().length,
    [form.rawDescription]
  );

  const loadHistory = useCallback(async () => {
    try {
      setPageError(null);
      const result = await getJobDescriptionAnalyses();
      setHistory(result);
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to load JD history."));
    }
  }, []);

  useEffect(() => {
    async function initialLoad() {
      try {
        setIsLoadingHistory(true);
        await loadHistory();
      } finally {
        setIsLoadingHistory(false);
      }
    }

    initialLoad();
  }, [loadHistory]);

  useEffect(() => {
    if (!isAnalyzing) {
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
  }, [isAnalyzing]);

  function updateField(field: keyof JdAnalyzerFormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      setLoadingStep(0);
      setIsAnalyzing(true);
      setPageError(null);
      setSuccessMessage(null);

      const result = await analyzeJobDescription(buildAnalyzePayload(form));

      setSelectedAnalysis(result);
      setSuccessMessage("Job description analyzed successfully.");
      await loadHistory();
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);

      if (fieldErrors) {
        setFormErrors((currentErrors) => ({
          ...currentErrors,
          ...fieldErrors,
        }));
      }

      const errorCode = getApiErrorCode(error);

      if (errorCode === "JD_ANALYSIS_FAILED") {
        setPageError(
          "We could not analyze this job description right now. Please try again in a moment."
        );
      } else {
        setPageError(
          getApiErrorMessage(error, "Unable to analyze job description.")
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSelectHistoryItem(jobDescriptionId: number) {
    try {
      setIsLoadingDetail(true);
      setPageError(null);

      const result = await getJobDescriptionAnalysisById(jobDescriptionId);

      setSelectedAnalysis(result);
    } catch (error) {
      setPageError(
        getApiErrorMessage(error, "Unable to load job description analysis.")
      );
    } finally {
      setIsLoadingDetail(false);
    }
  }

  async function handleDeleteHistoryItem(item: JobDescriptionListItem) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job description analysis? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);
      setPageError(null);
      setSuccessMessage(null);

      await deleteJobDescriptionAnalysis(item.id);

      if (selectedAnalysis?.id === item.id) {
        setSelectedAnalysis(null);
      }

      setSuccessMessage("Job description analysis deleted successfully.");
      await loadHistory();
    } catch (error) {
      setPageError(
        getApiErrorMessage(error, "Unable to delete job description analysis.")
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Intelligence"
        description="Analyze job descriptions and prepare your resume for targeted opportunities."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
  <button
    type="button"
    onClick={() => setActiveTab("RESUMES")}
    className={`rounded-2xl border p-4 text-left transition ${
      activeTab === "RESUMES"
        ? "border-brand-500/50 bg-brand-500/15 text-white"
        : "border-slate-800 bg-slate-950/70 text-slate-400 hover:bg-slate-900"
    }`}
  >
    <p className="font-semibold">Resumes</p>
    <p className="mt-1 text-xs text-slate-500">
      Upload and manage resume versions
    </p>
  </button>

  <button
    type="button"
    onClick={() => setActiveTab("JD_ANALYZER")}
    className={`rounded-2xl border p-4 text-left transition ${
      activeTab === "JD_ANALYZER"
        ? "border-brand-500/50 bg-brand-500/15 text-white"
        : "border-slate-800 bg-slate-950/70 text-slate-400 hover:bg-slate-900"
    }`}
  >
    <p className="font-semibold">JD Analyzer</p>
    <p className="mt-1 text-xs text-slate-500">
      Structured job description intelligence
    </p>
  </button>

  <button
    type="button"
    onClick={() => setActiveTab("TAILOR_RESUME")}
    className={`rounded-2xl border p-4 text-left transition ${
      activeTab === "TAILOR_RESUME"
        ? "border-brand-500/50 bg-brand-500/15 text-white"
        : "border-slate-800 bg-slate-950/70 text-slate-400 hover:bg-slate-900"
    }`}
  >
    <p className="font-semibold">Tailor Resume</p>
    <p className="mt-1 text-xs text-slate-500">Tailored resume for your next application</p>
  </button>

  <button
    type="button"
    onClick={() => setActiveTab("ATS_ANALYZER")}
    className={`rounded-2xl border p-4 text-left transition ${
      activeTab === "ATS_ANALYZER"
        ? "border-brand-500/50 bg-brand-500/15 text-white"
        : "border-slate-800 bg-slate-950/70 text-slate-400 hover:bg-slate-900"
    }`}
  >
    <p className="font-semibold">ATS Analyzer</p>
    <p className="mt-1 text-xs text-slate-500">Analyze resume-JD compatibility</p>
  </button>
</section>

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

      {activeTab === "RESUMES" ? <ResumeManager /> : null}

      {activeTab === "TAILOR_RESUME" ? <TailorResume /> : null}

      {activeTab === "ATS_ANALYZER" ? <ATSAnalyzer /> : null}

      {activeTab === "JD_ANALYZER" ? (
        <section className="grid min-w-0 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="min-w-0 space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                  <FileSearch size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Analyze Job Description
                  </h2>
                  <p className="text-sm text-slate-500">
                    Paste a JD and extract structured intelligence.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Job description
                  </label>

                  <Textarea
                    value={form.rawDescription}
                    onChange={(event) =>
                      updateField("rawDescription", event.target.value)
                    }
                    rows={12}
                    placeholder="Paste the complete job description here..."
                  />

                  <div className="flex justify-between gap-3 text-xs">
                    {formErrors.rawDescription ? (
                      <p className="text-red-300">
                        {formErrors.rawDescription}
                      </p>
                    ) : (
                      <p className="text-slate-500">
                        Required. Minimum 100 characters.
                      </p>
                    )}

                    <p
                      className={
                        rawDescriptionLength > 15000
                          ? "text-red-300"
                          : "text-slate-500"
                      }
                    >
                      {rawDescriptionLength}/15000
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">
                      Display name
                    </label>

                    <Input
                      value={form.displayName}
                      onChange={(event) =>
                        updateField("displayName", event.target.value)
                      }
                      placeholder="ABC Tech Backend Engineer JD"
                    />

                    {formErrors.displayName ? (
                      <p className="text-sm text-red-300">
                        {formErrors.displayName}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">
                      Company name
                    </label>

                    <Input
                      value={form.companyName}
                      onChange={(event) =>
                        updateField("companyName", event.target.value)
                      }
                      placeholder="ABC Tech"
                    />

                    {formErrors.companyName ? (
                      <p className="text-sm text-red-300">
                        {formErrors.companyName}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">
                      Job title
                    </label>

                    <Input
                      value={form.jobTitle}
                      onChange={(event) =>
                        updateField("jobTitle", event.target.value)
                      }
                      placeholder="Backend Engineer"
                    />

                    {formErrors.jobTitle ? (
                      <p className="text-sm text-red-300">
                        {formErrors.jobTitle}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">
                      Source
                    </label>

                    <select
                      value={form.source}
                      onChange={(event) =>
                        updateField("source", event.target.value)
                      }
                      className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-brand-500"
                    >
                      <option value="">Select source</option>
                      {sourceOptions.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>

                    {formErrors.source ? (
                      <p className="text-sm text-red-300">
                        {formErrors.source}
                      </p>
                    ) : null}
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4">
                    <div className="flex items-center gap-3 text-sm text-brand-200">
                      <Loader2 size={17} className="animate-spin" />
                      {loadingMessages[loadingStep]}
                    </div>
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BrainCircuit size={16} />
                      Analyze Job Description
                    </>
                  )}
                </Button>
              </form>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    JD History
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Previously analyzed job descriptions.
                  </p>
                </div>

                <Button type="button" size="sm" variant="secondary">
                  <Plus size={15} />
                  New
                </Button>
              </div>

              {isLoadingHistory ? (
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                  Loading history...
                </div>
              ) : history.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
                  No job descriptions analyzed yet. Paste a job description to
                  extract skills, responsibilities, and keywords.
                </div>
              ) : (
                <div className="space-y-3">
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
                          onClick={() => handleSelectHistoryItem(item.id)}
                          className="block w-full text-left"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-white">
                                {getDisplayName(item)}
                              </h3>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {(item.companyName ?? "Unknown company") +
                                  " · " +
                                  (item.jobTitle ?? "Unknown role")}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {item.source ?? "Source not set"} ·{" "}
                                {formatDate(item.createdAt)}
                              </p>
                            </div>

                            <Badge
                              variant={getAnalysisStatusBadgeVariant(
                                item.analysisStatus
                              )}
                            >
                              {item.analysisStatus === "COMPLETED"
                                ? "Completed"
                                : "Failed"}
                            </Badge>
                          </div>
                        </button>

                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="mt-3"
                          disabled={isDeleting}
                          onClick={() => handleDeleteHistoryItem(item)}
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
            </section>
          </div>

          <div className="min-w-0">
            {isLoadingDetail ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/80 shadow-premium">
                <div className="flex items-center gap-3 text-slate-400">
                  <Loader2 size={18} className="animate-spin" />
                  Loading analysis...
                </div>
              </div>
            ) : (
              <JdAnalysisResult selectedAnalysis={selectedAnalysis} />
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}