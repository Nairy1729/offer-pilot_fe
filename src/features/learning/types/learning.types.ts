export type LearningCategory =
  | "DSA"
  | "SPRING_BOOT"
  | "SYSTEM_DESIGN"
  | "REACT";

export type LearningStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NEEDS_REVISION";

export type LearningDifficulty = "EASY" | "MEDIUM" | "HARD";

export type LearningTopic = {
  id: number;
  userId: number;
  category: LearningCategory;
  title: string;
  description: string | null;
  status: LearningStatus;
  difficulty: LearningDifficulty | null;
  estimatedMinutes: number | null;
  targetDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateLearningTopicRequest = {
  category: LearningCategory;
  title: string;
  description?: string;
  difficulty?: LearningDifficulty;
  estimatedMinutes?: number;
  targetDate?: string;
};

export type UpdateLearningTopicRequest = {
  category: LearningCategory;
  title: string;
  description?: string;
  difficulty?: LearningDifficulty;
  estimatedMinutes?: number;
  targetDate?: string;
};

export type UpdateLearningTopicStatusRequest = {
  status: LearningStatus;
};

export type LearningTopicFilters = {
  category?: LearningCategory;
  status?: LearningStatus;
};

export type CategoryProgress = {
  category: LearningCategory;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
};

export type LearningSummary = {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  needsRevisionTopics: number;
  completionPercentage: number;
  categoryProgress: CategoryProgress[];
};