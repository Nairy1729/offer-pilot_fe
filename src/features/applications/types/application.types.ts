export type ApplicationStatus =
  | "APPLIED"
  | "ONLINE_ASSESSMENT"
  | "HR"
  | "L1"
  | "L2"
  | "OFFER"
  | "REJECTED";

export type JobApplication = {
  id: number;
  userId: number;
  companyName: string;
  roleTitle: string;
  jobLink: string | null;
  status: ApplicationStatus;
  appliedDate: string | null;
  recruiterEmail: string | null;
  nextAction: string | null;
  nextActionDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateApplicationRequest = {
  companyName: string;
  roleTitle: string;
  jobLink?: string;
  status?: ApplicationStatus;
  appliedDate?: string;
  recruiterEmail?: string;
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
};

export type UpdateApplicationRequest = {
  companyName: string;
  roleTitle: string;
  jobLink?: string;
  status?: ApplicationStatus;
  appliedDate?: string;
  recruiterEmail?: string;
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
};

export type UpdateApplicationStatusRequest = {
  status: ApplicationStatus;
};

export type ApplicationFilters = {
  status?: ApplicationStatus;
  search?: string;
};

export type ApplicationStatusCount = {
  status: ApplicationStatus;
  count: number;
};

export type ApplicationSummary = {
  totalApplications: number;
  statusCounts: ApplicationStatusCount[];
};