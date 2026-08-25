export type ResumeSourceType =
  | "MASTER_RESUME"
  | "TAILORED_RESUME"
  | "EXTERNAL_UPLOAD";

export type AtsReadinessLevel = "STRONG" | "MODERATE" | "WEAK";

export type AtsMatchType = "MATCHED" | "PARTIALLY_MATCHED" | "MISSING";

export type AtsSectionStatus = "GOOD" | "NEEDS_IMPROVEMENT" | "MISSING";

export type AtsRecommendationPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type AnalyzeSavedResumeRequest = {
  resumeSourceType: "MASTER_RESUME";
  resumeId: number;
  jobDescriptionId: number;
};

export type AnalyzeTailoredResumeRequest = {
  resumeSourceType: "TAILORED_RESUME";
  tailoredResumeId: number;
};

export type AnalyzeAtsRequest =
  | AnalyzeSavedResumeRequest
  | AnalyzeTailoredResumeRequest;

export type AtsScoreBreakdown = {
  requiredSkillsScore?: number;
  preferredSkillsScore?: number;
  keywordScore?: number;
  experienceScore?: number;
  responsibilityScore?: number;
  educationScore?: number;
  structureScore?: number;
  formattingScore?: number;
};

export type AtsSkillMatch = {
  skill: string;
  matchType: AtsMatchType;
  category: string | null;
  evidence: string | null;
};

export type AtsKeywordMatch = {
  keyword: string;
  matchType: AtsMatchType;
  matchedText: string | null;
  category: string | null;
};

export type AtsSectionAnalysis = {
  sectionName: string;
  status: AtsSectionStatus;
  message: string;
};

export type AtsRecommendation = {
  priority: AtsRecommendationPriority;
  title: string;
  description: string;
};

export type AtsAnalysis = {
  id: number;
  resumeSourceType: ResumeSourceType;
  resumeId: number | null;
  tailoredResumeId: number | null;
  jobDescriptionId: number;
  jobTitle: string | null;
  companyName: string | null;
  overallScore: number;
  readinessLevel: AtsReadinessLevel;
  scoringVersion: string;
  scoreBreakdown: AtsScoreBreakdown;
  requiredSkillMatches: AtsSkillMatch[];
  preferredSkillMatches: AtsSkillMatch[];
  keywordMatches: AtsKeywordMatch[];
  sectionAnalysis: AtsSectionAnalysis[];
  recommendations: AtsRecommendation[];
  createdAt: string;
};

export type AtsAnalysisListItem = {
  id: number;
  resumeSourceType: ResumeSourceType;
  resumeId: number | null;
  tailoredResumeId: number | null;
  jobDescriptionId: number;
  jobTitle: string | null;
  companyName: string | null;
  overallScore: number;
  readinessLevel: AtsReadinessLevel;
  scoringVersion: string;
  createdAt: string;
};

export type AtsCompareResumeInput = {
  resumeSourceType: "MASTER_RESUME" | "TAILORED_RESUME";
  resumeId?: number;
  tailoredResumeId?: number;
};

export type AtsCompareRequest = {
  jobDescriptionId: number;
  resumeA: AtsCompareResumeInput;
  resumeB: AtsCompareResumeInput;
};

export type AtsCompareResumeResult = {
  resumeSourceType: ResumeSourceType;
  resumeId: number | null;
  tailoredResumeId: number | null;
  label: string;
  overallScore: number;
  readinessLevel: AtsReadinessLevel;
  scoreBreakdown: AtsScoreBreakdown;
};

export type AtsCompareResponse = {
  jobDescriptionId: number;
  jobTitle: string | null;
  companyName: string | null;
  resumeA: AtsCompareResumeResult;
  resumeB: AtsCompareResumeResult;
  scoreDelta: number;
  breakdownDelta: Record<string, number>;
  summary: string;
};