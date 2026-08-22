export type TailoredResumeStatus = "DRAFT" | "GENERATED" | "FAILED";

export type TailoredResumeTemplate = "PROFESSIONAL_DEFAULT";

export type SkillMatchType = "MATCHED" | "PARTIALLY_MATCHED" | "MISSING";

export type SkillMatch = {
  skill: string;
  matchType: SkillMatchType;
  evidence: string | null;
};

export type TailoredResumeSkills = {
  programmingLanguages?: string[];
  frameworks?: string[];
  databases?: string[];
  cloud?: string[];
  tools?: string[];
  other?: string[];
};

export type TailoredResumeExperience = {
  company?: string | null;
  role?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  bullets?: string[];
};

export type TailoredResumeProject = {
  name?: string | null;
  description?: string | null;
  technologies?: string[];
  bullets?: string[];
};

export type TailoredResumeEducation =
  | string
  | {
      institution?: string | null;
      degree?: string | null;
      field?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      details?: string[];
      description?: string | null;
    };

export type TailoredResumeStructuredContent = {
  contactInfo?: TailoredResumeContactInfo | null;
  professionalSummary?: string | null;
  skills?: TailoredResumeSkills | null;
  experience?: TailoredResumeExperience[];
  projects?: TailoredResumeProject[];
  education?: TailoredResumeEducation[];
  certifications?: string[];
  achievements?: string[];
  tailoringNotes?: string[];
};

export type TailoredResume = {
  id: number;
  userId: number;
  sourceResumeId: number;
  sourceResumeName: string | null;
  sourceResumeOriginalFileName: string | null;
  jobDescriptionId: number;
  jobDescriptionName: string | null;
  targetCompany: string | null;
  targetJobTitle: string | null;
  displayName: string | null;
  templateName: TailoredResumeTemplate;
  status: TailoredResumeStatus;
  structuredContent: TailoredResumeStructuredContent | null;
  matchedSkills: SkillMatch[];
  partiallyMatchedSkills: SkillMatch[];
  missingSkills: SkillMatch[];
  tailoringNotes: string[];
  hasLatex: boolean;
  hasPdf: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TailoredResumeListItem = {
  id: number;
  userId: number;
  sourceResumeId: number;
  sourceResumeName: string | null;
  sourceResumeOriginalFileName: string | null;
  jobDescriptionId: number;
  jobDescriptionName: string | null;
  targetCompany: string | null;
  targetJobTitle: string | null;
  displayName: string | null;
  templateName: TailoredResumeTemplate;
  status: TailoredResumeStatus;
  hasLatex: boolean;
  hasPdf: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GenerateTailoredResumeRequest = {
  resumeId: number;
  jobDescriptionId: number;
  displayName?: string;
  templateName?: TailoredResumeTemplate;
};

export type TailoredResumeContactInfo = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
};