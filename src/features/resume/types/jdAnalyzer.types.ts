export type AnalysisStatus = "COMPLETED" | "FAILED";

export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE" | "NOT_SPECIFIED";

export type SkillPriority = "HIGH" | "MEDIUM" | "LOW";

export type KeywordCategory =
  | "TECHNICAL_SKILL"
  | "TECHNOLOGY"
  | "FRAMEWORK"
  | "DATABASE"
  | "CLOUD"
  | "TOOL"
  | "DOMAIN"
  | "SOFT_SKILL"
  | "ROLE_TERM"
  | "OTHER";

export type JdAnalysisItem = {
  id: number;
  text: string;
  normalizedText: string | null;
  category: KeywordCategory | null;
  priority: SkillPriority | null;
  evidence: string | null;
};

export type JdAnalysis = {
  extractedJobTitle: string | null;
  extractedCompanyName: string | null;
  seniority: string | null;
  minYearsExperience: number | null;
  maxYearsExperience: number | null;
  employmentType: string | null;
  location: string | null;
  workMode: WorkMode | null;
  requiredSkills: JdAnalysisItem[];
  preferredSkills: JdAnalysisItem[];
  responsibilities: JdAnalysisItem[];
  requiredQualifications: JdAnalysisItem[];
  preferredQualifications: JdAnalysisItem[];
  softSkills: JdAnalysisItem[];
  technologies: JdAnalysisItem[];
  keywords: JdAnalysisItem[];
  importantPhrases: JdAnalysisItem[];
};

export type JobDescriptionAnalysis = {
  id: number;
  displayName: string | null;
  companyName: string | null;
  jobTitle: string | null;
  source: string | null;
  rawDescription: string;
  analysisStatus: AnalysisStatus;
  analysis: JdAnalysis | null;
  createdAt: string;
  updatedAt: string;
};

export type JobDescriptionListItem = {
  id: number;
  displayName: string | null;
  companyName: string | null;
  jobTitle: string | null;
  source: string | null;
  analysisStatus: AnalysisStatus;
  createdAt: string;
  updatedAt: string;
};

export type AnalyzeJobDescriptionRequest = {
  rawDescription: string;
  companyName?: string;
  jobTitle?: string;
  source?: string;
  displayName?: string;
};