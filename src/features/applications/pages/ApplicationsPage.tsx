import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Edit3,
  Eye,
  ExternalLink,
  Loader2,
  Mail,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { PageHeader } from "../../../components/common/PageHeader";
import {
  getApiErrorCode,
  getApiErrorMessage,
  getApiFieldErrors,
} from "../../../services/apiError";
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  getApplicationSummary,
  updateApplication,
  updateApplicationStatus,
} from "../services/applicationService";
import type {
  ApplicationStatus,
  ApplicationSummary,
  JobApplication,
  UpdateApplicationRequest,
} from "../types/application.types";

type ApplicationFormState = {
  companyName: string;
  roleTitle: string;
  jobLink: string;
  status: ApplicationStatus | "";
  appliedDate: string;
  recruiterEmail: string;
  nextAction: string;
  nextActionDate: string;
  notes: string;
};

type ApplicationFormErrors = Partial<Record<keyof ApplicationFormState, string>>;

const statusOptions: Array<{
  value: ApplicationStatus;
  label: string;
}> = [
  {
    value: "APPLIED",
    label: "Applied",
  },
  {
    value: "ONLINE_ASSESSMENT",
    label: "Online Assessment",
  },
  {
    value: "HR",
    label: "HR",
  },
  {
    value: "L1",
    label: "L1 Technical",
  },
  {
    value: "L2",
    label: "L2 Technical",
  },
  {
    value: "OFFER",
    label: "Offer",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
];

const emptyApplicationForm: ApplicationFormState = {
  companyName: "",
  roleTitle: "",
  jobLink: "",
  status: "APPLIED",
  appliedDate: "",
  recruiterEmail: "",
  nextAction: "",
  nextActionDate: "",
  notes: "",
};

const emptySummary: ApplicationSummary = {
  totalApplications: 0,
  statusCounts: [],
};

function getStatusLabel(status: ApplicationStatus) {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

function getStatusBadgeVariant(status: ApplicationStatus) {
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

function getStatusCount(summary: ApplicationSummary, status: ApplicationStatus) {
  return summary.statusCounts.find((item) => item.status === status)?.count ?? 0;
}

function emptyToUndefined(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function applicationToForm(application: JobApplication): ApplicationFormState {
  return {
    companyName: application.companyName ?? "",
    roleTitle: application.roleTitle ?? "",
    jobLink: application.jobLink ?? "",
    status: application.status ?? "APPLIED",
    appliedDate: application.appliedDate ?? "",
    recruiterEmail: application.recruiterEmail ?? "",
    nextAction: application.nextAction ?? "",
    nextActionDate: application.nextActionDate ?? "",
    notes: application.notes ?? "",
  };
}

function buildApplicationPayload(
  form: ApplicationFormState
): UpdateApplicationRequest {
  return {
    companyName: form.companyName.trim(),
    roleTitle: form.roleTitle.trim(),
    jobLink: emptyToUndefined(form.jobLink),
    status: form.status || undefined,
    appliedDate: emptyToUndefined(form.appliedDate),
    recruiterEmail: emptyToUndefined(form.recruiterEmail),
    nextAction: emptyToUndefined(form.nextAction),
    nextActionDate: emptyToUndefined(form.nextActionDate),
    notes: emptyToUndefined(form.notes),
  };
}

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

function validateForm(form: ApplicationFormState) {
  const errors: ApplicationFormErrors = {};

  if (!form.companyName.trim()) {
    errors.companyName = "Company name is required.";
  }

  if (form.companyName.trim().length > 150) {
    errors.companyName = "Company name must be at most 150 characters.";
  }

  if (!form.roleTitle.trim()) {
    errors.roleTitle = "Role title is required.";
  }

  if (form.roleTitle.trim().length > 150) {
    errors.roleTitle = "Role title must be at most 150 characters.";
  }

  if (form.jobLink.trim().length > 500) {
    errors.jobLink = "Job link must be at most 500 characters.";
  }

  if (form.recruiterEmail.trim().length > 150) {
    errors.recruiterEmail = "Recruiter email must be at most 150 characters.";
  }

  if (
    form.recruiterEmail.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recruiterEmail.trim())
  ) {
    errors.recruiterEmail = "Enter a valid recruiter email.";
  }

  if (form.nextAction.trim().length > 255) {
    errors.nextAction = "Next action must be at most 255 characters.";
  }

  if (form.notes.trim().length > 5000) {
    errors.notes = "Notes must be at most 5000 characters.";
  }

  return errors;
}

export function ApplicationsPage() {
  const [summary, setSummary] = useState<ApplicationSummary>(emptySummary);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);

  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const statusFilterRef = useRef(statusFilter);
  const searchQueryRef = useRef(searchQuery);

  const [form, setForm] = useState<ApplicationFormState>(emptyApplicationForm);
  const [formErrors, setFormErrors] = useState<ApplicationFormErrors>({});
  const [editingApplicationId, setEditingApplicationId] = useState<number | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<
    number | null
  >(null);
  const [deletingApplicationId, setDeletingApplicationId] = useState<
    number | null
  >(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activePipelineCount = useMemo(() => {
    return (
      getStatusCount(summary, "APPLIED") +
      getStatusCount(summary, "ONLINE_ASSESSMENT") +
      getStatusCount(summary, "HR") +
      getStatusCount(summary, "L1") +
      getStatusCount(summary, "L2")
    );
  }, [summary]);

  useEffect(() => {
    statusFilterRef.current = statusFilter;
    searchQueryRef.current = searchQuery;
  }, [searchQuery, statusFilter]);

  const loadApplications = useCallback(async () => {
    try {
      setPageError(null);

      const [summaryResult, applicationsResult] = await Promise.all([
        getApplicationSummary(),
        getApplications({
          status: statusFilterRef.current || undefined,
          search: searchQueryRef.current.trim() || undefined,
        }),
      ]);

      setSummary(summaryResult);
      setApplications(applicationsResult);
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to load applications."));
    }
  }, []);

  useEffect(() => {
    async function initialLoad() {
      try {
        setIsLoading(true);
        await loadApplications();
      } finally {
        setIsLoading(false);
      }
    }

    initialLoad();
  }, [loadApplications, statusFilter]);

  async function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadApplications();
  }

  async function clearFilters() {
    setStatusFilter("");
    setSearchQuery("");

    try {
      setIsLoading(true);

      const [summaryResult, applicationsResult] = await Promise.all([
        getApplicationSummary(),
        getApplications(),
      ]);

      setSummary(summaryResult);
      setApplications(applicationsResult);
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to clear filters."));
    } finally {
      setIsLoading(false);
    }
  }

  function updateField(field: keyof ApplicationFormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  function openCreateForm() {
    setEditingApplicationId(null);
    setForm(emptyApplicationForm);
    setFormErrors({});
    setSuccessMessage(null);
    setPageError(null);
    setIsFormOpen(true);
  }

  function openEditForm(application: JobApplication) {
    setEditingApplicationId(application.id);
    setForm(applicationToForm(application));
    setFormErrors({});
    setSuccessMessage(null);
    setPageError(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingApplicationId(null);
    setForm(emptyApplicationForm);
    setFormErrors({});
    setIsFormOpen(false);
  }

  async function handleViewDetail(applicationId: number) {
    try {
      setIsDetailLoading(true);
      setPageError(null);

      const application = await getApplicationById(applicationId);

      setSelectedApplication(application);
    } catch (error) {
      setPageError(
        getApiErrorMessage(error, "Unable to load application details.")
      );
    } finally {
      setIsDetailLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      setIsSaving(true);
      setPageError(null);
      setSuccessMessage(null);

      const payload = buildApplicationPayload(form);

      if (editingApplicationId) {
        await updateApplication(editingApplicationId, payload);
        setSuccessMessage("Application updated successfully.");
      } else {
        await createApplication(payload);
        setSuccessMessage("Application created successfully.");
      }

      closeForm();
      await loadApplications();
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);

      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          if (
            field === "companyName" ||
            field === "roleTitle" ||
            field === "jobLink" ||
            field === "status" ||
            field === "appliedDate" ||
            field === "recruiterEmail" ||
            field === "nextAction" ||
            field === "nextActionDate" ||
            field === "notes"
          ) {
            setFormErrors((currentErrors) => ({
              ...currentErrors,
              [field]: message,
            }));
          }
        });
      }

      setPageError(getApiErrorMessage(error, "Unable to save application."));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(
    applicationId: number,
    status: ApplicationStatus
  ) {
    try {
      setUpdatingApplicationId(applicationId);
      setPageError(null);
      setSuccessMessage(null);

      await updateApplicationStatus(applicationId, {
        status,
      });

      setSuccessMessage(`Application moved to ${getStatusLabel(status)}.`);
      await loadApplications();

      if (selectedApplication?.id === applicationId) {
        await handleViewDetail(applicationId);
      }
    } catch (error) {
      setPageError(
        getApiErrorMessage(error, "Unable to update application status.")
      );
    } finally {
      setUpdatingApplicationId(null);
    }
  }

  async function handleDelete(application: JobApplication) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingApplicationId(application.id);
      setPageError(null);
      setSuccessMessage(null);

      await deleteApplication(application.id);

      if (selectedApplication?.id === application.id) {
        setSelectedApplication(null);
      }

      if (editingApplicationId === application.id) {
        closeForm();
      }

      setSuccessMessage("Application deleted successfully.");
      await loadApplications();
    } catch (error) {
      const errorCode = getApiErrorCode(error);

      if (errorCode === "RESOURCE_NOT_FOUND") {
        setSuccessMessage("Application was already deleted.");
        await loadApplications();
        return;
      }

      setPageError(getApiErrorMessage(error, "Unable to delete application."));
    } finally {
      setDeletingApplicationId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading applications...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Applications"
          description="Track your job search pipeline and next actions."
        />

        <Button onClick={openCreateForm}>
          <Plus size={16} />
          Add Application
        </Button>
      </div>

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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
          <p className="text-sm text-slate-500">Total Applications</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {summary.totalApplications}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
          <p className="text-sm text-slate-500">Active Pipeline</p>
          <p className="mt-3 text-3xl font-semibold text-brand-300">
            {activePipelineCount}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
          <p className="text-sm text-slate-500">Offers</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-300">
            {getStatusCount(summary, "OFFER")}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="mt-3 text-3xl font-semibold text-red-300">
            {getStatusCount(summary, "REJECTED")}
          </p>
        </div>
      </section>

      {isFormOpen ? (
        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingApplicationId
                  ? "Edit Application"
                  : "Add Application"}
              </h2>
              <p className="text-sm text-slate-500">
                Keep company, role, status, and next action details updated.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Company name
                </label>

                <Input
                  value={form.companyName}
                  onChange={(event) =>
                    updateField("companyName", event.target.value)
                  }
                  placeholder="Razorpay"
                />

                {formErrors.companyName ? (
                  <p className="text-sm text-red-300">
                    {formErrors.companyName}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Role title
                </label>

                <Input
                  value={form.roleTitle}
                  onChange={(event) =>
                    updateField("roleTitle", event.target.value)
                  }
                  placeholder="Java Backend Developer"
                />

                {formErrors.roleTitle ? (
                  <p className="text-sm text-red-300">
                    {formErrors.roleTitle}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-brand-500"
                >
                  <option value="">Backend default</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {formErrors.status ? (
                  <p className="text-sm text-red-300">{formErrors.status}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Applied date
                </label>

                <Input
                  type="date"
                  value={form.appliedDate}
                  onChange={(event) =>
                    updateField("appliedDate", event.target.value)
                  }
                />

                {formErrors.appliedDate ? (
                  <p className="text-sm text-red-300">
                    {formErrors.appliedDate}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">
                  Job link
                </label>

                <Input
                  value={form.jobLink}
                  onChange={(event) => updateField("jobLink", event.target.value)}
                  placeholder="https://careers.company.com/jobs/backend-dev"
                />

                {formErrors.jobLink ? (
                  <p className="text-sm text-red-300">{formErrors.jobLink}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Recruiter email
                </label>

                <Input
                  type="email"
                  value={form.recruiterEmail}
                  onChange={(event) =>
                    updateField("recruiterEmail", event.target.value)
                  }
                  placeholder="recruiter@company.com"
                />

                {formErrors.recruiterEmail ? (
                  <p className="text-sm text-red-300">
                    {formErrors.recruiterEmail}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Next action date
                </label>

                <Input
                  type="date"
                  value={form.nextActionDate}
                  onChange={(event) =>
                    updateField("nextActionDate", event.target.value)
                  }
                />

                {formErrors.nextActionDate ? (
                  <p className="text-sm text-red-300">
                    {formErrors.nextActionDate}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">
                  Next action
                </label>

                <Input
                  value={form.nextAction}
                  onChange={(event) =>
                    updateField("nextAction", event.target.value)
                  }
                  placeholder="Follow up with recruiter"
                />

                {formErrors.nextAction ? (
                  <p className="text-sm text-red-300">
                    {formErrors.nextAction}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">
                  Notes
                </label>

                <Textarea
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Applied through careers page. Referral submitted. OA link received."
                  rows={4}
                />

                {formErrors.notes ? (
                  <p className="text-sm text-red-300">{formErrors.notes}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingApplicationId
                      ? "Update application"
                      : "Create application"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Application Pipeline
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search, filter, and move opportunities through stages.
              </p>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="grid gap-3 sm:grid-cols-[1fr_auto] xl:w-[520px]"
            >
              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3">
                <Search size={16} className="shrink-0 text-slate-500" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search company or role..."
                  className="h-10 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="secondary">
                  Search
                </Button>

                <Button type="button" variant="secondary" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </form>
          </div>

<div className="mt-6 max-w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 p-2">
  <div className="overflow-x-auto">
    <div className="flex w-max gap-2 pb-1">
      <button
        type="button"
        onClick={() => setStatusFilter("")}
        className={`w-32 shrink-0 rounded-xl px-3 py-3 text-left text-sm transition ${
          statusFilter === ""
            ? "bg-brand-500/15 text-white ring-1 ring-brand-500/40"
            : "text-slate-400 hover:bg-slate-900 hover:text-white"
        }`}
      >
        <div className="truncate font-medium">All</div>
        <div className="mt-1 text-xs text-slate-500">
          {summary.totalApplications}
        </div>
      </button>

      {statusOptions.map((statusOption) => {
        const isActive = statusFilter === statusOption.value;

        return (
          <button
            key={statusOption.value}
            type="button"
            onClick={() => setStatusFilter(statusOption.value)}
            className={`w-40 shrink-0 rounded-xl px-3 py-3 text-left text-sm transition ${
              isActive
                ? "bg-brand-500/15 text-white ring-1 ring-brand-500/40"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <div className="truncate font-medium">
              {statusOption.label}
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <Badge variant={getStatusBadgeVariant(statusOption.value)}>
                {getStatusCount(summary, statusOption.value)}
              </Badge>

              <span className="text-xs text-slate-500">items</span>
            </div>
          </button>
        );
      })}
    </div>
  </div>
</div>

          {applications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                <BriefcaseBusiness size={22} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-white">
                No applications found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Add your first job application or adjust your search and filters.
              </p>

              <Button className="mt-5" onClick={openCreateForm}>
                <Plus size={16} />
                Add Application
              </Button>
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[980px] border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Company</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Applied</th>
                    <th className="px-3 py-2">Next Action</th>
                    <th className="px-3 py-2">Next Date</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => {
                    const isUpdating = updatingApplicationId === application.id;
                    const isDeleting = deletingApplicationId === application.id;

                    return (
                      <tr
                        key={application.id}
                        className="rounded-2xl bg-slate-900/60 text-sm"
                      >
                        <td className="rounded-l-2xl px-3 py-4 font-medium text-white">
                          {application.companyName}
                        </td>

                        <td className="px-3 py-4 text-slate-300">
                          {application.roleTitle}
                        </td>

                        <td className="px-3 py-4">
                          <select
                            value={application.status}
                            disabled={isUpdating}
                            onChange={(event) =>
                              handleStatusChange(
                                application.id,
                                event.target.value as ApplicationStatus
                              )
                            }
                            className="h-9 rounded-xl border border-slate-800 bg-slate-950 px-2 text-xs text-white outline-none"
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-3 py-4 text-slate-400">
                          {formatDate(application.appliedDate)}
                        </td>

                        <td className="max-w-[220px] truncate px-3 py-4 text-slate-400">
                          {application.nextAction ?? "No next action set"}
                        </td>

                        <td className="px-3 py-4 text-slate-400">
                          {formatDate(application.nextActionDate)}
                        </td>

                        <td className="rounded-r-2xl px-3 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              disabled={isDetailLoading}
                              onClick={() => handleViewDetail(application.id)}
                            >
                              <Eye size={15} />
                              View
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => openEditForm(application)}
                            >
                              <Edit3 size={15} />
                              Edit
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              disabled={isDeleting}
                              onClick={() => handleDelete(application)}
                            >
                              {isDeleting ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <h2 className="text-lg font-semibold text-white">
            Application Detail
          </h2>

          {isDetailLoading ? (
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading detail...
            </div>
          ) : selectedApplication ? (
            <div className="mt-6 space-y-5 text-sm">
              <div>
                <p className="text-slate-500">Company</p>
                <p className="mt-1 font-medium text-white">
                  {selectedApplication.companyName}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Role</p>
                <p className="mt-1 font-medium text-white">
                  {selectedApplication.roleTitle}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Status</p>
                <div className="mt-2">
                  <Badge
                    variant={getStatusBadgeVariant(selectedApplication.status)}
                  >
                    {getStatusLabel(selectedApplication.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-slate-500">Applied Date</p>
                <p className="mt-1 text-slate-300">
                  {formatDate(selectedApplication.appliedDate)}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Recruiter Email</p>
                <p className="mt-1 flex items-center gap-2 text-slate-300">
                  <Mail size={14} />
                  {selectedApplication.recruiterEmail ?? "Not set"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Next Action</p>
                <p className="mt-1 text-slate-300">
                  {selectedApplication.nextAction ?? "No next action set"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Next Action Date</p>
                <p className="mt-1 flex items-center gap-2 text-slate-300">
                  <CalendarDays size={14} />
                  {formatDate(selectedApplication.nextActionDate)}
                </p>
              </div>

              {selectedApplication.jobLink ? (
                <a
                  href={selectedApplication.jobLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-brand-300 hover:text-brand-200"
                >
                  <ExternalLink size={14} />
                  Open job link
                </a>
              ) : null}

              <div>
                <p className="text-slate-500">Notes</p>
                <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-slate-300">
                  {selectedApplication.notes ?? "No notes added."}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
              Select an application to view full details.
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}