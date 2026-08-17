import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Edit3,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Search,
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
  createLearningTopic,
  deleteLearningTopic,
  getLearningSummary,
  getLearningTopics,
  updateLearningTopic,
  updateLearningTopicStatus,
} from "../services/learningService";
import type {
  CategoryProgress,
  CreateLearningTopicRequest,
  LearningCategory,
  LearningDifficulty,
  LearningStatus,
  LearningSummary,
  LearningTopic,
  UpdateLearningTopicRequest,
} from "../types/learning.types";

type TopicFormState = {
  category: LearningCategory | "";
  title: string;
  description: string;
  difficulty: LearningDifficulty | "";
  estimatedMinutes: string;
  targetDate: string;
};

type TopicFormErrors = Partial<Record<keyof TopicFormState, string>>;

const categoryOptions: Array<{
  value: LearningCategory;
  label: string;
}> = [
  {
    value: "DSA",
    label: "DSA",
  },
  {
    value: "SPRING_BOOT",
    label: "Spring Boot",
  },
  {
    value: "SYSTEM_DESIGN",
    label: "System Design",
  },
  {
    value: "REACT",
    label: "React",
  },
];

const statusOptions: Array<{
  value: LearningStatus;
  label: string;
}> = [
  {
    value: "NOT_STARTED",
    label: "Not Started",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "NEEDS_REVISION",
    label: "Needs Revision",
  },
];

const difficultyOptions: Array<{
  value: LearningDifficulty;
  label: string;
}> = [
  {
    value: "EASY",
    label: "Easy",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "HARD",
    label: "Hard",
  },
];

const emptyTopicForm: TopicFormState = {
  category: "",
  title: "",
  description: "",
  difficulty: "",
  estimatedMinutes: "",
  targetDate: "",
};

const emptySummary: LearningSummary = {
  totalTopics: 0,
  completedTopics: 0,
  inProgressTopics: 0,
  notStartedTopics: 0,
  needsRevisionTopics: 0,
  completionPercentage: 0,
  categoryProgress: [],
};

function getCategoryLabel(category: LearningCategory) {
  return (
    categoryOptions.find((option) => option.value === category)?.label ??
    category
  );
}

function getStatusLabel(status: LearningStatus) {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

function getDifficultyLabel(difficulty: LearningDifficulty | null) {
  if (!difficulty) {
    return "Not set";
  }

  return (
    difficultyOptions.find((option) => option.value === difficulty)?.label ??
    difficulty
  );
}

function getCategoryBadgeVariant(category: LearningCategory) {
  if (category === "DSA") {
    return "violet";
  }

  if (category === "SPRING_BOOT") {
    return "green";
  }

  if (category === "SYSTEM_DESIGN") {
    return "blue";
  }

  return "slate";
}

function getStatusBadgeVariant(status: LearningStatus) {
  if (status === "COMPLETED") {
    return "green";
  }

  if (status === "IN_PROGRESS") {
    return "blue";
  }

  if (status === "NEEDS_REVISION") {
    return "amber";
  }

  return "slate";
}

function getDifficultyBadgeVariant(difficulty: LearningDifficulty | null) {
  if (difficulty === "EASY") {
    return "green";
  }

  if (difficulty === "MEDIUM") {
    return "amber";
  }

  if (difficulty === "HARD") {
    return "red";
  }

  return "slate";
}

function emptyToUndefined(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function optionalNumber(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  return Number(value);
}

function topicToForm(topic: LearningTopic): TopicFormState {
  return {
    category: topic.category,
    title: topic.title,
    description: topic.description ?? "",
    difficulty: topic.difficulty ?? "",
    estimatedMinutes:
      topic.estimatedMinutes !== null ? String(topic.estimatedMinutes) : "",
    targetDate: topic.targetDate ?? "",
  };
}

function buildCreatePayload(form: TopicFormState): CreateLearningTopicRequest {
  return {
    category: form.category as LearningCategory,
    title: form.title.trim(),
    description: emptyToUndefined(form.description),
    difficulty: form.difficulty || undefined,
    estimatedMinutes: optionalNumber(form.estimatedMinutes),
    targetDate: emptyToUndefined(form.targetDate),
  };
}

function buildUpdatePayload(form: TopicFormState): UpdateLearningTopicRequest {
  return {
    category: form.category as LearningCategory,
    title: form.title.trim(),
    description: emptyToUndefined(form.description),
    difficulty: form.difficulty || undefined,
    estimatedMinutes: optionalNumber(form.estimatedMinutes),
    targetDate: emptyToUndefined(form.targetDate),
  };
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

function validateForm(form: TopicFormState) {
  const errors: TopicFormErrors = {};

  if (!form.category) {
    errors.category = "Category is required.";
  }

  if (!form.title.trim()) {
    errors.title = "Topic title is required.";
  }

  if (form.title.trim().length > 200) {
    errors.title = "Topic title must be at most 200 characters.";
  }

  if (form.description.trim().length > 3000) {
    errors.description = "Description must be at most 3000 characters.";
  }

  if (form.estimatedMinutes.trim()) {
    const estimatedMinutes = Number(form.estimatedMinutes);

    if (Number.isNaN(estimatedMinutes)) {
      errors.estimatedMinutes = "Estimated minutes must be a valid number.";
    } else if (estimatedMinutes < 5 || estimatedMinutes > 1440) {
      errors.estimatedMinutes =
        "Estimated minutes must be between 5 and 1440.";
    }
  }

  return errors;
}

function getProgressForCategory(
  categoryProgress: CategoryProgress[],
  category: LearningCategory
): CategoryProgress {
  return (
    categoryProgress.find((item) => item.category === category) ?? {
      category,
      totalTopics: 0,
      completedTopics: 0,
      completionPercentage: 0,
    }
  );
}

export function LearningPage() {
  const [summary, setSummary] = useState<LearningSummary>(emptySummary);
  const [topics, setTopics] = useState<LearningTopic[]>([]);

  const [categoryFilter, setCategoryFilter] = useState<LearningCategory | "">("");
  const [statusFilter, setStatusFilter] = useState<LearningStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState<TopicFormState>(emptyTopicForm);
  const [formErrors, setFormErrors] = useState<TopicFormErrors>({});
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingTopicId, setUpdatingTopicId] = useState<number | null>(null);
  const [deletingTopicId, setDeletingTopicId] = useState<number | null>(null);

  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredTopics = useMemo(() => {
    const trimmedSearch = searchQuery.trim().toLowerCase();

    if (!trimmedSearch) {
      return topics;
    }

    return topics.filter((topic) =>
      topic.title.toLowerCase().includes(trimmedSearch)
    );
  }, [topics, searchQuery]);

  async function loadLearningData() {
    try {
      setPageError(null);

      const [summaryResult, topicResults] = await Promise.all([
        getLearningSummary(),
        getLearningTopics({
          category: categoryFilter || undefined,
          status: statusFilter || undefined,
        }),
      ]);

      setSummary(summaryResult);
      setTopics(topicResults);
    } catch (error) {
      setPageError(
        getApiErrorMessage(error, "Unable to load learning tracker.")
      );
    }
  }

  useEffect(() => {
    async function initialLoad() {
      try {
        setIsLoading(true);
        await loadLearningData();
      } finally {
        setIsLoading(false);
      }
    }

    initialLoad();
  }, [categoryFilter, statusFilter]);

  function updateField(field: keyof TopicFormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  function openCreateForm() {
    setEditingTopicId(null);
    setForm(emptyTopicForm);
    setFormErrors({});
    setSuccessMessage(null);
    setPageError(null);
    setIsFormOpen(true);
  }

  function openEditForm(topic: LearningTopic) {
    setEditingTopicId(topic.id);
    setForm(topicToForm(topic));
    setFormErrors({});
    setSuccessMessage(null);
    setPageError(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingTopicId(null);
    setForm(emptyTopicForm);
    setFormErrors({});
    setIsFormOpen(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      setIsSaving(true);
      setPageError(null);
      setSuccessMessage(null);

      if (editingTopicId) {
        await updateLearningTopic(editingTopicId, buildUpdatePayload(form));
        setSuccessMessage("Learning topic updated successfully.");
      } else {
        await createLearningTopic(buildCreatePayload(form));
        setSuccessMessage("Learning topic created successfully.");
      }

      closeForm();
      await loadLearningData();
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);

      if (fieldErrors) {
        setFormErrors((currentErrors) => ({
          ...currentErrors,
          ...fieldErrors,
        }));
      }

      setPageError(
        getApiErrorMessage(error, "Unable to save learning topic.")
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(topicId: number, status: LearningStatus) {
    try {
      setUpdatingTopicId(topicId);
      setPageError(null);
      setSuccessMessage(null);

      await updateLearningTopicStatus(topicId, {
        status,
      });

      setSuccessMessage(`Topic marked as ${getStatusLabel(status)}.`);
      await loadLearningData();
    } catch (error) {
      setPageError(
        getApiErrorMessage(error, "Unable to update topic status.")
      );
    } finally {
      setUpdatingTopicId(null);
    }
  }

  async function handleDelete(topic: LearningTopic) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this learning topic? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTopicId(topic.id);
      setPageError(null);
      setSuccessMessage(null);

      await deleteLearningTopic(topic.id);

      if (editingTopicId === topic.id) {
        closeForm();
      }

      setSuccessMessage("Learning topic deleted successfully.");
      await loadLearningData();
    } catch (error) {
      const errorCode = getApiErrorCode(error);

      if (errorCode === "RESOURCE_NOT_FOUND") {
        setSuccessMessage("Topic was already deleted.");
        await loadLearningData();
        return;
      }

      setPageError(
        getApiErrorMessage(error, "Unable to delete learning topic.")
      );
    } finally {
      setDeletingTopicId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading learning tracker...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Tracker"
        description="Track your preparation across DSA, Spring Boot, System Design, and React."
        action={
          <Button onClick={openCreateForm}>
            <Plus size={16} />
            Add Topic
          </Button>
        }
      />

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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
          <p className="text-sm text-slate-500">Completion</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {summary.completionPercentage}%
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
              style={{
                width: `${summary.completionPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
          <p className="text-sm text-slate-500">Total Topics</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {summary.totalTopics}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-300">
            {summary.completedTopics}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="mt-3 text-3xl font-semibold text-brand-300">
            {summary.inProgressTopics}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
          <p className="text-sm text-slate-500">Needs Revision</p>
          <p className="mt-3 text-3xl font-semibold text-amber-300">
            {summary.needsRevisionTopics}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categoryOptions.map((categoryOption) => {
          const progress = getProgressForCategory(
            summary.categoryProgress,
            categoryOption.value
          );

          return (
            <button
              key={categoryOption.value}
              type="button"
              onClick={() => setCategoryFilter(categoryOption.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-left shadow-premium transition hover:border-brand-500/50 hover:bg-slate-900/80"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {categoryOption.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {progress.completedTopics} of {progress.totalTopics} done
                  </p>
                </div>

                <Badge variant={getCategoryBadgeVariant(categoryOption.value)}>
                  {progress.completionPercentage}%
                </Badge>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
                  style={{
                    width: `${progress.completionPercentage}%`,
                  }}
                />
              </div>
            </button>
          );
        })}
      </section>

      {summary.totalTopics === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">
          Start adding learning topics to see your progress.
        </div>
      ) : null}

      {isFormOpen ? (
        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
              <BookOpenCheck size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingTopicId ? "Edit Learning Topic" : "Add Learning Topic"}
              </h2>
              <p className="text-sm text-slate-500">
                Keep your preparation items clear, measurable, and actionable.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {formErrors.category ? (
                  <p className="text-sm text-red-300">{formErrors.category}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Difficulty
                </label>

                <select
                  value={form.difficulty}
                  onChange={(event) =>
                    updateField("difficulty", event.target.value)
                  }
                  className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
                >
                  <option value="">Select difficulty</option>
                  {difficultyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {formErrors.difficulty ? (
                  <p className="text-sm text-red-300">
                    {formErrors.difficulty}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">
                  Topic title
                </label>

                <Input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Revise Spring Security JWT flow"
                />

                {formErrors.title ? (
                  <p className="text-sm text-red-300">{formErrors.title}</p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">
                  Description
                </label>

                <Textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Add preparation details, notes, or scope for this topic."
                  rows={4}
                />

                {formErrors.description ? (
                  <p className="text-sm text-red-300">
                    {formErrors.description}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Estimated minutes
                </label>

                <Input
                  type="number"
                  min="5"
                  max="1440"
                  value={form.estimatedMinutes}
                  onChange={(event) =>
                    updateField("estimatedMinutes", event.target.value)
                  }
                  placeholder="90"
                />

                {formErrors.estimatedMinutes ? (
                  <p className="text-sm text-red-300">
                    {formErrors.estimatedMinutes}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Target date
                </label>

                <Input
                  type="date"
                  value={form.targetDate}
                  onChange={(event) =>
                    updateField("targetDate", event.target.value)
                  }
                />

                {formErrors.targetDate ? (
                  <p className="text-sm text-red-300">
                    {formErrors.targetDate}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingTopicId ? "Update topic" : "Create topic"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Learning Topics
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Filter, update, and maintain your preparation roadmap.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[680px]">
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3">
              <Search size={16} className="shrink-0 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search topics..."
                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value as LearningCategory | "")
              }
              className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-brand-500"
            >
              <option value="">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as LearningStatus | "")
              }
              className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-brand-500"
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
              <BookOpenCheck size={22} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-white">
              {topics.length === 0
                ? "No learning topics yet"
                : "No topics found"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {topics.length === 0
                ? "Create your first topic to start tracking your preparation."
                : "Try changing the category, status, or search filter."}
            </p>

            {topics.length === 0 ? (
              <Button className="mt-5" onClick={openCreateForm}>
                <Plus size={16} />
                Add Topic
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map((topic) => {
              const isTopicUpdating = updatingTopicId === topic.id;
              const isTopicDeleting = deletingTopicId === topic.id;

              return (
                <article
                  key={topic.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={getCategoryBadgeVariant(topic.category)}>
                          {getCategoryLabel(topic.category)}
                        </Badge>

                        <Badge variant={getStatusBadgeVariant(topic.status)}>
                          {getStatusLabel(topic.status)}
                        </Badge>

                        <Badge
                          variant={getDifficultyBadgeVariant(topic.difficulty)}
                        >
                          {getDifficultyLabel(topic.difficulty)}
                        </Badge>
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-white">
                        {topic.title}
                      </h3>

                      {topic.description ? (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                          {topic.description}
                        </p>
                      ) : null}

                      <div className="mt-4 grid gap-3 text-sm text-slate-500 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <Clock3 size={15} />
                          <span>
                            Estimated:{" "}
                            <span className="text-slate-300">
                              {topic.estimatedMinutes
                                ? `${topic.estimatedMinutes} mins`
                                : "Not set"}
                            </span>
                          </span>
                        </div>

                        <div>
                          Target:{" "}
                          <span className="text-slate-300">
                            {formatDate(topic.targetDate)}
                          </span>
                        </div>

                        <div>
                          Completed:{" "}
                          <span className="text-slate-300">
                            {formatDate(topic.completedAt)}
                          </span>
                        </div>

                        <div>
                          Updated:{" "}
                          <span className="text-slate-300">
                            {formatDate(topic.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 xl:justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isTopicUpdating}
                        onClick={() =>
                          handleStatusChange(topic.id, "NOT_STARTED")
                        }
                      >
                        Reset
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isTopicUpdating}
                        onClick={() =>
                          handleStatusChange(topic.id, "IN_PROGRESS")
                        }
                      >
                        {isTopicUpdating ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <RefreshCcw size={15} />
                        )}
                        Progress
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isTopicUpdating}
                        onClick={() =>
                          handleStatusChange(topic.id, "COMPLETED")
                        }
                      >
                        <CheckCircle2 size={15} />
                        Done
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isTopicUpdating}
                        onClick={() =>
                          handleStatusChange(topic.id, "NEEDS_REVISION")
                        }
                      >
                        Revise
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditForm(topic)}
                      >
                        <Edit3 size={15} />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isTopicDeleting}
                        onClick={() => handleDelete(topic)}
                      >
                        {isTopicDeleting ? (
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
  );
}