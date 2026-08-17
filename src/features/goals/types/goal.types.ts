export type GoalStatus = "ACTIVE" | "PAUSED" | "ACHIEVED" | "ARCHIVED";

export type Goal = {
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

export type CreateGoalRequest = {
  targetRole: string;
  targetSalaryLpa?: number;
  targetCompanies?: string;
  deadline?: string;
  preferredTechStack?: string;
  dailyStudyHours?: number;
};

export type UpdateGoalRequest = {
  targetRole: string;
  targetSalaryLpa?: number;
  targetCompanies?: string;
  deadline?: string;
  preferredTechStack?: string;
  dailyStudyHours?: number;
};

export type UpdateGoalStatusRequest = {
  status: GoalStatus;
};