import { useEffect, useState } from "react";
import { Loader2, Save, UserRound } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { PageHeader } from "../../../components/common/PageHeader";
import { getApiErrorMessage } from "../../../services/apiError";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "../services/profileService";
import type {
  UpdateUserProfileRequest,
  UserProfile,
} from "../types/profile.types";

type ProfileFormState = {
  fullName: string;
  currentCompany: string;
  currentRole: string;
  yearsOfExperience: string;
  currentCtcLpa: string;
  preferredLocation: string;
  noticePeriodDays: string;
  phoneNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
};

function profileToForm(profile: UserProfile): ProfileFormState {
  return {
    fullName: profile.fullName ?? "",
    currentCompany: profile.currentCompany ?? "",
    currentRole: profile.currentRole ?? "",
    yearsOfExperience:
      profile.yearsOfExperience !== null ? String(profile.yearsOfExperience) : "",
    currentCtcLpa:
      profile.currentCtcLpa !== null ? String(profile.currentCtcLpa) : "",
    preferredLocation: profile.preferredLocation ?? "",
    noticePeriodDays:
      profile.noticePeriodDays !== null ? String(profile.noticePeriodDays) : "",
    phoneNumber: profile.phoneNumber ?? "",
    linkedinUrl: profile.linkedinUrl ?? "",
    githubUrl: profile.githubUrl ?? "",
    portfolioUrl: profile.portfolioUrl ?? "",
  };
}

function emptyToUndefined(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function optionalNumber(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  return Number(value);
}

function buildProfilePayload(form: ProfileFormState): UpdateUserProfileRequest {
  return {
    fullName: emptyToUndefined(form.fullName),
    currentCompany: emptyToUndefined(form.currentCompany),
    currentRole: emptyToUndefined(form.currentRole),
    yearsOfExperience: optionalNumber(form.yearsOfExperience),
    currentCtcLpa: optionalNumber(form.currentCtcLpa),
    preferredLocation: emptyToUndefined(form.preferredLocation),
    noticePeriodDays: optionalNumber(form.noticePeriodDays),
    phoneNumber: emptyToUndefined(form.phoneNumber),
    linkedinUrl: emptyToUndefined(form.linkedinUrl),
    githubUrl: emptyToUndefined(form.githubUrl),
    portfolioUrl: emptyToUndefined(form.portfolioUrl),
  };
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileFormState>({
    fullName: "",
    currentCompany: "",
    currentRole: "",
    yearsOfExperience: "",
    currentCtcLpa: "",
    preferredLocation: "",
    noticePeriodDays: "",
    phoneNumber: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setPageError(null);

        const currentProfile = await getCurrentUserProfile();

        setProfile(currentProfile);
        setForm(profileToForm(currentProfile));
      } catch (error) {
        setPageError(
          getApiErrorMessage(error, "Unable to load profile details.")
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(field: keyof ProfileFormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setSuccessMessage(null);
      setPageError(null);

      const updatedProfile = await updateCurrentUserProfile(
        buildProfilePayload(form)
      );

      setProfile(updatedProfile);
      setForm(profileToForm(updatedProfile));
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Unable to update profile."));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your professional profile and job-switch readiness details."
      />

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

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
              <UserRound size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Professional Details
              </h2>
              <p className="text-sm text-slate-500">
                Keep this updated for better recommendations later.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Full name
              </label>
              <Input
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder="Rahul Sharma"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Email
              </label>
              <Input value={profile?.email ?? ""} disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Current company
              </label>
              <Input
                value={form.currentCompany}
                onChange={(event) =>
                  updateField("currentCompany", event.target.value)
                }
                placeholder="Hexaware Technologies"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Current role
              </label>
              <Input
                value={form.currentRole}
                onChange={(event) =>
                  updateField("currentRole", event.target.value)
                }
                placeholder="Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Years of experience
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.yearsOfExperience}
                onChange={(event) =>
                  updateField("yearsOfExperience", event.target.value)
                }
                placeholder="2.5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Current CTC in LPA
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.currentCtcLpa}
                onChange={(event) =>
                  updateField("currentCtcLpa", event.target.value)
                }
                placeholder="8.5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Preferred location
              </label>
              <Input
                value={form.preferredLocation}
                onChange={(event) =>
                  updateField("preferredLocation", event.target.value)
                }
                placeholder="Bengaluru"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Notice period in days
              </label>
              <Input
                type="number"
                min="0"
                value={form.noticePeriodDays}
                onChange={(event) =>
                  updateField("noticePeriodDays", event.target.value)
                }
                placeholder="60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Phone number
              </label>
              <Input
                value={form.phoneNumber}
                onChange={(event) =>
                  updateField("phoneNumber", event.target.value)
                }
                placeholder="+91 9876543210"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                LinkedIn URL
              </label>
              <Input
                value={form.linkedinUrl}
                onChange={(event) =>
                  updateField("linkedinUrl", event.target.value)
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                GitHub URL
              </label>
              <Input
                value={form.githubUrl}
                onChange={(event) =>
                  updateField("githubUrl", event.target.value)
                }
                placeholder="https://github.com/username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Portfolio URL
              </label>
              <Input
                value={form.portfolioUrl}
                onChange={(event) =>
                  updateField("portfolioUrl", event.target.value)
                }
                placeholder="https://yourname.dev"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save profile
                </>
              )}
            </Button>
          </div>
        </form>

        <aside className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <h2 className="text-lg font-semibold text-white">
            Profile Summary
          </h2>

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-slate-500">Name</p>
              <p className="mt-1 font-medium text-white">
                {profile?.fullName ?? "Not available"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Email</p>
              <p className="mt-1 font-medium text-white">
                {profile?.email ?? "Not available"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Role</p>
              <p className="mt-1 font-medium text-white">
                {profile?.currentRole ?? "Not added"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Experience</p>
              <p className="mt-1 font-medium text-white">
                {profile?.yearsOfExperience ?? "Not added"} years
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}