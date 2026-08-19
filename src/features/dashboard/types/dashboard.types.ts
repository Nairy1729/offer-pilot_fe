export type GoalStatus = "ACTIVE" | "PAUSED" | "ACHIEVED" | "ARCHIVED";

export type DashboardGoal = {
  id: number;
  userId: number;
  targetRole: string;
  targetSalaryLpa: number | null;
  targetCompanies: string | null;
  deadline: string | null;
  preferredTechStack: string | null;
  dailyStudyHours: number | null;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
};

export type LearningCategory =
  | "DSA"
  | "SPRING_BOOT"
  | "SYSTEM_DESIGN"
  | "REACT";

export type CategoryProgress = {
  category: LearningCategory;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
};

export type DashboardLearningSummary = {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  needsRevisionTopics: number;
  completionPercentage: number;
  categoryProgress: CategoryProgress[];
};

export type ApplicationStatus =
  | "APPLIED"
  | "ONLINE_ASSESSMENT"
  | "HR"
  | "L1"
  | "L2"
  | "OFFER"
  | "REJECTED";

export type ApplicationStatusCount = {
  status: ApplicationStatus;
  count: number;
};

export type DashboardApplicationSummary = {
  totalApplications: number;
  statusCounts: ApplicationStatusCount[];
};

export type DashboardTaskType = "LEARNING" | "APPLICATION";

export type DashboardTaskPriority = "HIGH" | "MEDIUM" | "LOW";

export type TodayTask = {
  type: DashboardTaskType;
  priority: DashboardTaskPriority;
  sourceId: number;
  title: string;
  description: string | null;
  dueDate: string | null;
};

export type UpcomingAction = {
  type: DashboardTaskType;
  sourceId: number;
  title: string;
  description: string | null;
  actionDate: string | null;
};

export type DashboardData = {
  activeGoal: DashboardGoal | null;
  learningSummary: DashboardLearningSummary;
  applicationSummary: DashboardApplicationSummary;
  todayTasks: TodayTask[];
  upcomingActions: UpcomingAction[];
};