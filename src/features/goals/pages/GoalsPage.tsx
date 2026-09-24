import { useEffect, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Loader2,
  PauseCircle,
  Plus,
  Save,
  Target,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { PageHeader } from "../../../components/common/PageHeader";
import {
  getApiErrorCode,
  getApiErrorMessage,
} from "../../../services/apiError";
import {
  createGoal,
  getActiveGoal,
  getGoals,
  updateGoal,
  updateGoalStatus,
} from "../services/goalService";
import type {
  CreateGoalRequest,
  Goal,
  GoalStatus,
  UpdateGoalRequest,
} from "../types/goal.types";

type GoalFormState = {
  targetRole: string;
  targetSalaryLpa: string;
  targetCompanies: string;
  deadline: string;
  preferredTechStack: string;
  dailyStudyHours: string;
};

const emptyGoalForm: GoalFormState = {
  targetRole: "",
  targetSalaryLpa: "",
  targetCompanies: "",
  deadline: "",
  preferredTechStack: "",
  dailyStudyHours: "",
};

function goalToForm(goal: Goal): GoalFormState {
  return {
    targetRole: goal.targetRole ?? "",
    targetSalaryLpa:
      goal.targetSalaryLpa !== null ? String(goal.targetSalaryLpa) : "",
    targetCompanies: goal.targetCompanies ?? "",
    deadline: goal.deadline ?? "",
    preferredTechStack: goal.preferredTechStack ?? "",
    dailyStudyHours:
      goal.dailyStudyHours !== null ? String(goal.dailyStudyHours) : "",
  };
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

function buildCreateGoalPayload(form: GoalFormState): CreateGoalRequest {
  return {
    targetRole: form.targetRole.trim(),
    targetSalaryLpa: optionalNumber(form.targetSalaryLpa),
    targetCompanies: emptyToUndefined(form.targetCompanies),
    deadline: emptyToUndefined(form.deadline),
    preferredTechStack: emptyToUndefined(form.preferredTechStack),
    dailyStudyHours: optionalNumber(form.dailyStudyHours),
  };
}

function buildUpdateGoalPayload(form: GoalFormState): UpdateGoalRequest {
  return {
    targetRole: form.targetRole.trim(),
    targetSalaryLpa: optionalNumber(form.targetSalaryLpa),
    targetCompanies: emptyToUndefined(form.targetCompanies),
    deadline: emptyToUndefined(form.deadline),
    preferredTechStack: emptyToUndefined(form.preferredTechStack),
    dailyStudyHours: optionalNumber(form.dailyStudyHours),
  };
}

function getStatusBadgeVariant(status: GoalStatus) {
  if (status === "ACTIVE") {
    return "blue";
  }

  if (status === "ACHIEVED") {
    return "green";
  }

  if (status === "PAUSED") {
    return "amber";
  }

  return "slate";
}

export function GoalsPage() {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [form, setForm] = useState<GoalFormState>(emptyGoalForm);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadGoalsPage() {
      try {
        setIsLoading(true);
        setPageError(null);

        const [goalsList, activeGoalResult] = await Promise.all([
          getGoals(),
          getActiveGoal().catch((error) => {
            const errorCode = getApiErrorCode(error);

            if (errorCode === "RESOURCE_NOT_FOUND") {
              return null;
            }

            throw error;
          }),
        ]);

        setGoals(goalsList);
        setActiveGoal(activeGoalResult);

        if (activeGoalResult) {
          setSelectedGoalId(activeGoalResult.id);
          setForm(goalToForm(activeGoalResult));
        } else {
          setSelectedGoalId(null);
          setForm(emptyGoalForm);
        }
      } catch (error) {
        setPageError(getApiErrorMessage(error, "Unable to load goals."));
      } finally {
        setIsLoading(false);
      }
    }

    loadGoalsPage();
  }, []);

  function updateField(field: keyof GoalFormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleSelectGoal(goal: Goal) {
    setSelectedGoalId(goal.id);
    setForm(goalToForm(goal));
    setSuccessMessage(null);
    setPageError(null);
  }

  function handleNewGoal() {
    setSelectedGoalId(null);
    setForm(emptyGoalForm);
    setSuccessMessage(null);
    setPageError(null);
  }

  async function reloadGoals(preferredGoalId?: number) {
    const [goalsList, activeGoalResult] = await Promise.all([
      getGoals(),
      getActiveGoal().catch((error) => {
        const errorCode = getApiErrorCode(error);

        if (errorCode === "RESOURCE_NOT_FOUND") {
          return null;
        }

        throw error;
      }),
    ]);

    setGoals(goalsList);
    setActiveGoal(activeGoalResult);

    if (preferredGoalId) {
      const preferredGoal =
        goalsList.find((goal) => goal.id === preferredGoalId) ?? null;

      if (preferredGoal) {
        setSelectedGoalId(preferredGoal.id);
        setForm(goalToForm(preferredGoal));
      }
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.targetRole.trim()) {
      setPageError("Target role is required.");
      return;
    }

    try {
      setIsSaving(true);
      setPageError(null);
      setSuccessMessage(null);

      if (selectedGoalId) {
        const updatedGoal = await updateGoal(
          selectedGoalId,
          buildUpdateGoalPayload(form)
        );

        await reloadGoals(updatedGoal.id);
        setSuccessMessage("Goal updated successfully.");
      } else {
        const createdGoal = await createGoal(buildCreateGoalPayload(form));

        await reloadGoals(createdGoal.id);
        setSuccessMessage("Goal created successfully.");
      }
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to save goal."));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(goalId: number, status: GoalStatus) {
    try {
      setIsSaving(true);
      setPageError(null);
      setSuccessMessage(null);

      const updatedGoal = await updateGoalStatus(goalId, {
        status,
      });

      await reloadGoals(updatedGoal.id);
      setSuccessMessage(`Goal marked as ${status.toLowerCase()}.`);
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to update goal status."));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading goals...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        description="Define your target offer and keep your preparation aligned with it."
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

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                <Target size={21} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {selectedGoalId ? "Edit Goal" : "Create Goal"}
                </h2>
                <p className="text-sm text-slate-500">
                  Use API format for deadline: YYYY-MM-DD.
                </p>
              </div>
            </div>

            <Button type="button" variant="secondary" onClick={handleNewGoal}>
              <Plus size={16} />
              New goal
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">
                Target role
              </label>
              <Input
                value={form.targetRole}
                onChange={(event) =>
                  updateField("targetRole", event.target.value)
                }
                placeholder="Java Backend Developer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Target salary in LPA
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.targetSalaryLpa}
                onChange={(event) =>
                  updateField("targetSalaryLpa", event.target.value)
                }
                placeholder="15"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Deadline
              </label>
              <Input
                type="date"
                value={form.deadline}
                onChange={(event) => updateField("deadline", event.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">
                Target companies
              </label>
              <Textarea
                value={form.targetCompanies}
                onChange={(event) =>
                  updateField("targetCompanies", event.target.value)
                }
                placeholder="Amazon, Walmart, PhonePe, Razorpay"
                rows={3}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">
                Preferred tech stack
              </label>
              <Textarea
                value={form.preferredTechStack}
                onChange={(event) =>
                  updateField("preferredTechStack", event.target.value)
                }
                placeholder="Java, Spring Boot, PostgreSQL, Redis, AWS"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Daily study hours
              </label>
              <Input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                value={form.dailyStudyHours}
                onChange={(event) =>
                  updateField("dailyStudyHours", event.target.value)
                }
                placeholder="3"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {selectedGoalId ? "Update goal" : "Create goal"}
                </>
              )}
            </Button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
            <h2 className="text-lg font-semibold text-white">Active Goal</h2>

            {activeGoal ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">
                      {activeGoal.targetRole}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Target:{" "}
                      {activeGoal.targetSalaryLpa
                        ? `${activeGoal.targetSalaryLpa} LPA`
                        : "Not specified"}
                    </p>
                  </div>

                  <Badge variant={getStatusBadgeVariant(activeGoal.status)}>
                    {activeGoal.status}
                  </Badge>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
                  <p>
                    Deadline:{" "}
                    <span className="text-slate-200">
                      {activeGoal.deadline ?? "Not set"}
                    </span>
                  </p>
                  <p className="mt-2">
                    Daily study:{" "}
                    <span className="text-slate-200">
                      {activeGoal.dailyStudyHours ?? "Not set"} hours
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
                No active goal found. Create one to start tracking your target
                offer.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
            <h2 className="text-lg font-semibold text-white">Goal History</h2>

            <div className="mt-5 space-y-3">
              {goals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
                  No goals created yet.
                </div>
              ) : (
                goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectGoal(goal)}
                      className="block w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {goal.targetRole}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Updated {goal.updatedAt}
                          </p>
                        </div>

                        <Badge variant={getStatusBadgeVariant(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                    </button>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isSaving}
                        onClick={() => handleStatusChange(goal.id, "ACTIVE")}
                      >
                        <Target size={15} />
                        Active
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isSaving}
                        onClick={() => handleStatusChange(goal.id, "PAUSED")}
                      >
                        <PauseCircle size={15} />
                        Pause
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isSaving}
                        onClick={() => handleStatusChange(goal.id, "ACHIEVED")}
                      >
                        <CheckCircle2 size={15} />
                        Achieved
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isSaving}
                        onClick={() => handleStatusChange(goal.id, "ARCHIVED")}
                      >
                        <Archive size={15} />
                        Archive
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}