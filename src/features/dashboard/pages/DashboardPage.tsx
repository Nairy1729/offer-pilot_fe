import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  RefreshCcw,
  Target,
  TrendingUp,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { APP_ROUTES } from "../../../lib/constants";
import { getApiErrorMessage } from "../../../services/apiError";
import { useAuthStore } from "../../auth/store/authStore";
import { getDashboard } from "../services/dashboardService";
import type {
  ApplicationStatus,
  CategoryProgress,
  DashboardApplicationSummary,
  DashboardData,
  DashboardLearningSummary,
  DashboardTaskPriority,
  DashboardTaskType,
  TodayTask,
  UpcomingAction,
} from "../types/dashboard.types";

type BadgeVariant = "blue" | "green" | "amber" | "red" | "violet" | "slate";

const emptyDashboard: DashboardData = {
  activeGoal: null,
  learningSummary: {
    totalTopics: 0,
    completedTopics: 0,
    inProgressTopics: 0,
    notStartedTopics: 0,
    needsRevisionTopics: 0,
    completionPercentage: 0,
    categoryProgress: [],
  },
  applicationSummary: {
    totalApplications: 0,
    statusCounts: [],
  },
  todayTasks: [],
  upcomingActions: [],
};

const categoryLabels: Record<string, string> = {
  DSA: "DSA",
  SPRING_BOOT: "Spring Boot",
  SYSTEM_DESIGN: "System Design",
  REACT: "React",
};

const applicationStatusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  ONLINE_ASSESSMENT: "Online Assessment",
  HR: "HR",
  L1: "L1 Technical",
  L2: "L2 Technical",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const priorityLabels: Record<DashboardTaskPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const taskTypeLabels: Record<DashboardTaskType, string> = {
  LEARNING: "Learning",
  APPLICATION: "Application",
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

function getApplicationStatusCount(
  summary: DashboardApplicationSummary,
  status: ApplicationStatus
) {
  return summary.statusCounts.find((item) => item.status === status)?.count ?? 0;
}

function getPriorityBadgeVariant(priority: DashboardTaskPriority): BadgeVariant {
  if (priority === "HIGH") {
    return "red";
  }

  if (priority === "MEDIUM") {
    return "amber";
  }

  return "slate";
}

function getTaskTypeBadgeVariant(type: DashboardTaskType): BadgeVariant {
  if (type === "LEARNING") {
    return "blue";
  }

  return "violet";
}

function getApplicationBadgeVariant(status: ApplicationStatus): BadgeVariant {
  if (status === "OFFER") {
    return "green";
  }

  if (status === "REJECTED") {
    return "red";
  }

  if (status === "ONLINE_ASSESSMENT") {
    return "violet";
  }

  if (status === "HR") {
    return "amber";
  }

  if (status === "L1" || status === "L2") {
    return "blue";
  }

  return "slate";
}

function getCategoryProgress(
  categoryProgress: CategoryProgress[],
  category: string
): CategoryProgress {
  return (
    categoryProgress.find((item) => item.category === category) ?? {
      category: category as CategoryProgress["category"],
      totalTopics: 0,
      completedTopics: 0,
      completionPercentage: 0,
    }
  );
}

function getTaskRoute(type: DashboardTaskType) {
  if (type === "LEARNING") {
    return APP_ROUTES.LEARNING;
  }

  return APP_ROUTES.APPLICATIONS;
}

function SummaryMetricCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string | number;
  tone: "brand" | "green" | "amber" | "red" | "slate";
  icon: React.ReactNode;
}) {
  const toneClassMap = {
    brand: "text-brand-300 bg-brand-500/15",
    green: "text-emerald-300 bg-emerald-500/15",
    amber: "text-amber-300 bg-amber-500/15",
    red: "text-red-300 bg-red-500/15",
    slate: "text-slate-300 bg-slate-800",
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${toneClassMap[tone]}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function TodayTaskCard({
  task,
  onOpen,
}: {
  task: TodayTask;
  onOpen: () => void;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getPriorityBadgeVariant(task.priority)}>
              {priorityLabels[task.priority]}
            </Badge>

            <Badge variant={getTaskTypeBadgeVariant(task.type)}>
              {taskTypeLabels[task.type]}
            </Badge>

            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <CalendarDays size={13} />
              {formatDate(task.dueDate)}
            </span>
          </div>

          <h3 className="mt-4 text-base font-semibold text-white">
            {task.title}
          </h3>

          {task.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {task.description}
            </p>
          ) : null}
        </div>

        <Button type="button" size="sm" variant="secondary" onClick={onOpen}>
          {task.type === "LEARNING" ? "View Topic" : "View Application"}
          <ArrowRight size={15} />
        </Button>
      </div>
    </article>
  );
}

function UpcomingActionCard({
  action,
  onOpen,
}: {
  action: UpcomingAction;
  onOpen: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getTaskTypeBadgeVariant(action.type)}>
          {taskTypeLabels[action.type]}
        </Badge>

        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays size={13} />
          {formatDate(action.actionDate)}
        </span>
      </div>

      <h3 className="mt-3 text-sm font-semibold text-white">{action.title}</h3>

      {action.description ? (
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {action.description}
        </p>
      ) : null}

      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="mt-4"
        onClick={onOpen}
      >
        Open
        <ArrowRight size={15} />
      </Button>
    </article>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const activePipelineCount = useMemo(() => {
    return (
      getApplicationStatusCount(dashboard.applicationSummary, "APPLIED") +
      getApplicationStatusCount(
        dashboard.applicationSummary,
        "ONLINE_ASSESSMENT"
      ) +
      getApplicationStatusCount(dashboard.applicationSummary, "HR") +
      getApplicationStatusCount(dashboard.applicationSummary, "L1") +
      getApplicationStatusCount(dashboard.applicationSummary, "L2")
    );
  }, [dashboard.applicationSummary]);

  async function loadDashboard(options?: { silent?: boolean }) {
    try {
      if (options?.silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setPageError(null);

      const data = await getDashboard();

      setDashboard(data);
    } catch (error) {
      setPageError(
        getApiErrorMessage(
          error,
          "We could not load your dashboard right now."
        )
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-premium">
          <div className="h-6 w-56 animate-pulse rounded bg-slate-800" />
          <div className="mt-4 h-4 w-80 max-w-full animate-pulse rounded bg-slate-800" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium"
            >
              <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-800" />
              <div className="mt-5 h-4 w-24 animate-pulse rounded bg-slate-800" />
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-slate-800" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-h-[320px] rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-premium">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-800" />
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-3xl bg-slate-900"
                />
              ))}
            </div>
          </div>

          <div className="min-h-[320px] rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-premium">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-800" />
            <div className="mt-6 space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-slate-900"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="w-full max-w-xl rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center shadow-premium">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
            <AlertCircle size={24} />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-white">
            Dashboard could not be loaded
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-200">{pageError}</p>

          <Button className="mt-6" onClick={() => loadDashboard()}>
            <RefreshCcw size={16} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const learningSummary = dashboard.learningSummary;
  const applicationSummary = dashboard.applicationSummary;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-premium">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%)]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-300">
              OfferPilot Command Center
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Welcome back, {user?.fullName ?? "there"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Here is what you should focus on today to move closer to your
              target offer.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            disabled={isRefreshing}
            onClick={() => loadDashboard({ silent: true })}
          >
            {isRefreshing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCcw size={16} />
            )}
            Refresh
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetricCard
          label="Today's Focus"
          value={dashboard.todayTasks.length}
          tone="brand"
          icon={<Target size={19} />}
        />

        <SummaryMetricCard
          label="Learning Completion"
          value={`${learningSummary.completionPercentage}%`}
          tone="green"
          icon={<GraduationCap size={19} />}
        />

        <SummaryMetricCard
          label="Active Pipeline"
          value={activePipelineCount}
          tone="amber"
          icon={<BriefcaseBusiness size={19} />}
        />

        <SummaryMetricCard
          label="Upcoming Actions"
          value={dashboard.upcomingActions.length}
          tone="slate"
          icon={<Clock3 size={19} />}
        />
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Today's Focus
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  High-impact actions to move you closer to your target offer.
                </p>
              </div>
            </div>

            {dashboard.todayTasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                  <CheckCircle2 size={23} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-white">
                  Nothing urgent today
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  You are clear for today. Consider adding learning targets or
                  application follow-ups to keep momentum.
                </p>

                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate(APP_ROUTES.LEARNING)}
                  >
                    Open Learning
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate(APP_ROUTES.APPLICATIONS)}
                  >
                    Open Applications
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard.todayTasks.map((task) => (
                  <TodayTaskCard
                    key={`${task.type}-${task.sourceId}-${task.dueDate}`}
                    task={task}
                    onOpen={() => navigate(getTaskRoute(task.type))}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Learning Progress
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Preparation progress across your core areas.
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(APP_ROUTES.LEARNING)}
                >
                  Open
                  <ArrowRight size={15} />
                </Button>
              </div>

              {learningSummary.totalTopics === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
                  No learning topics added yet. Add topics to start tracking
                  preparation.
                </div>
              ) : (
                <>
                  <div className="mt-6">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">
                          Overall Completion
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-white">
                          {learningSummary.completionPercentage}%
                        </p>
                      </div>

                      <div className="text-right text-sm text-slate-500">
                        <p>{learningSummary.completedTopics} completed</p>
                        <p>{learningSummary.totalTopics} total topics</p>
                      </div>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
                        style={{
                          width: `${learningSummary.completionPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {["DSA", "SPRING_BOOT", "SYSTEM_DESIGN", "REACT"].map(
                      (category) => {
                        const progress = getCategoryProgress(
                          learningSummary.categoryProgress,
                          category
                        );

                        return (
                          <div
                            key={category}
                            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium text-white">
                                {categoryLabels[category]}
                              </p>
                              <p className="text-xs text-slate-500">
                                {progress.completionPercentage}%
                              </p>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                              {progress.completedTopics} of{" "}
                              {progress.totalTopics} done
                            </p>

                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-brand-500"
                                style={{
                                  width: `${progress.completionPercentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Application Pipeline
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Current status of your job search funnel.
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(APP_ROUTES.APPLICATIONS)}
                >
                  Open
                  <ArrowRight size={15} />
                </Button>
              </div>

              {applicationSummary.totalApplications === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
                  No applications tracked yet. Add your first job application to
                  start tracking your pipeline.
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {(
                    [
                      "APPLIED",
                      "ONLINE_ASSESSMENT",
                      "HR",
                      "L1",
                      "L2",
                      "OFFER",
                      "REJECTED",
                    ] as ApplicationStatus[]
                  ).map((status) => (
                    <div
                      key={status}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3"
                    >
                      <Badge variant={getApplicationBadgeVariant(status)}>
                        {applicationStatusLabels[status]}
                      </Badge>

                      <span className="text-sm font-semibold text-white">
                        {getApplicationStatusCount(applicationSummary, status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Active Goal
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your current target offer.
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => navigate(APP_ROUTES.GOALS)}
              >
                Open
              </Button>
            </div>

            {dashboard.activeGoal ? (
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-slate-500">Target Role</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    {dashboard.activeGoal.targetRole}
                  </h3>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                    <p className="text-xs text-slate-500">Target Salary</p>
                    <p className="mt-1 font-semibold text-white">
                      {dashboard.activeGoal.targetSalaryLpa
                        ? `${dashboard.activeGoal.targetSalaryLpa} LPA`
                        : "Not set"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                    <p className="text-xs text-slate-500">Deadline</p>
                    <p className="mt-1 font-semibold text-white">
                      {formatDate(dashboard.activeGoal.deadline)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                    <p className="text-xs text-slate-500">Daily Study</p>
                    <p className="mt-1 font-semibold text-white">
                      {dashboard.activeGoal.dailyStudyHours
                        ? `${dashboard.activeGoal.dailyStudyHours} hours`
                        : "Not set"}
                    </p>
                  </div>
                </div>

                {dashboard.activeGoal.targetCompanies ? (
                  <div>
                    <p className="text-sm text-slate-500">Target Companies</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {dashboard.activeGoal.targetCompanies}
                    </p>
                  </div>
                ) : null}

                {dashboard.activeGoal.preferredTechStack ? (
                  <div>
                    <p className="text-sm text-slate-500">Tech Stack</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {dashboard.activeGoal.preferredTechStack}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
                <p>
                  No active goal set. Create your target offer goal to
                  personalize your dashboard.
                </p>

                <Button
                  type="button"
                  className="mt-5 w-full"
                  onClick={() => navigate(APP_ROUTES.GOALS)}
                >
                  Create Goal
                </Button>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
            <h2 className="text-lg font-semibold text-white">
              Upcoming Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Follow-ups and preparation deadlines coming soon.
            </p>

            {dashboard.upcomingActions.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
                No upcoming actions scheduled. Add target dates or next actions
                to stay organized.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {dashboard.upcomingActions.map((action) => (
                  <UpcomingActionCard
                    key={`${action.type}-${action.sourceId}-${action.actionDate}`}
                    action={action}
                    onOpen={() => navigate(getTaskRoute(action.type))}
                  />
                ))}
              </div>
            )}
          </section>
        </aside>
      </section>
    </div>
  );
}