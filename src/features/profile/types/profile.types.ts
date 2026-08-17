export type UserRole = "USER" | "ADMIN";

export type UserProfile = {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  currentCompany: string | null;
  currentRole: string | null;
  yearsOfExperience: number | null;
  currentCtcLpa: number | null;
  preferredLocation: string | null;
  noticePeriodDays: number | null;
  phoneNumber: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserProfileRequest = {
  fullName?: string;
  currentCompany?: string;
  currentRole?: string;
  yearsOfExperience?: number;
  currentCtcLpa?: number;
  preferredLocation?: string;
  noticePeriodDays?: number;
  phoneNumber?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
};