import { X } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import type {
  TailoredResume,
  TailoredResumeStructuredContent,
} from "../types/tailoredResume.types";

type TailoredResumePreviewModalProps = {
  open: boolean;
  tailoredResume: TailoredResume | null;
  onClose: () => void;
};

function ContactInfoHeader({
  contactInfo,
}: {
  contactInfo: TailoredResumeStructuredContent["contactInfo"];
}) {
  if (!contactInfo) {
    return null;
  }

  const contactItems = [
    contactInfo.email,
    contactInfo.phone,
    contactInfo.location,
    contactInfo.linkedinUrl,
    contactInfo.githubUrl,
    contactInfo.portfolioUrl,
  ].filter(Boolean);

  if (!contactInfo.fullName && contactItems.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-center shadow-premium">
      {contactInfo.fullName ? (
        <h1 className="break-words text-3xl font-semibold tracking-tight text-white">
          {contactInfo.fullName}
        </h1>
      ) : null}

      {contactItems.length > 0 ? (
        <div className="mx-auto mt-3 flex max-w-4xl flex-wrap justify-center gap-x-3 gap-y-2 text-sm text-slate-300">
          {contactItems.map((item, index) => (
            <span key={`${item}-${index}`} className="break-words">
              {item}
              {index < contactItems.length - 1 ? (
                <span className="ml-3 text-slate-600">|</span>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      <p className="mx-auto mt-4 max-w-2xl text-xs leading-5 text-amber-200">
        AI-generated draft. Please review contact details before downloading or
        applying.
      </p>
    </section>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-5">{children}</div>
    </section>
    
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
      {message}
    </div>
  );
}

function BulletList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return <EmptyBlock message={emptyText} />;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-3 text-sm leading-6 text-slate-300"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
          <span className="break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SkillsPreview({
  skills,
}: {
  skills: TailoredResumeStructuredContent["skills"];
}) {
  const groups = [
    {
      label: "Programming Languages",
      values: skills?.programmingLanguages ?? [],
    },
    {
      label: "Frameworks",
      values: skills?.frameworks ?? [],
    },
    {
      label: "Databases",
      values: skills?.databases ?? [],
    },
    {
      label: "Cloud",
      values: skills?.cloud ?? [],
    },
    {
      label: "Tools",
      values: skills?.tools ?? [],
    },
    {
      label: "Other",
      values: skills?.other ?? [],
    },
  ].filter((group) => group.values.length > 0);

  if (groups.length === 0) {
    return <EmptyBlock message="No supported resume skills were generated." />;
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.label}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
        >
          <p className="text-sm font-medium text-white">{group.label}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {group.values.map((skill) => (
              <Badge key={skill} variant="blue">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TailoredResumePreviewModal({
  open,
  tailoredResume,
  onClose,
}: TailoredResumePreviewModalProps) {
  if (!open) {
    return null;
  }

  const structuredContent = tailoredResume?.structuredContent;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-premium">
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-300">
              Generated Resume Preview
            </p>

            <h2 className="mt-1 break-words text-xl font-semibold text-white">
              {tailoredResume?.displayName ||
                tailoredResume?.jobDescriptionName ||
                "Tailored Resume"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-generated draft. Please review carefully before applying.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X size={20} />
          </Button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          {!tailoredResume ? (
            <EmptyBlock message="No tailored resume selected." />
          ) : !structuredContent ? (
            <EmptyBlock message="Structured resume content was not found for this tailored resume." />
          ) : (
            <div className="space-y-6">
                <ContactInfoHeader contactInfo={structuredContent.contactInfo} />
              <SectionCard
                title="Professional Summary"
                description="Role-specific summary generated from your master resume and selected JD."
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                  {structuredContent.professionalSummary ||
                    "No professional summary generated."}
                </p>
              </SectionCard>

              <SectionCard
                title="Skills"
                description="Missing JD skills are intentionally not added here unless supported by your master resume."
              >
                <SkillsPreview skills={structuredContent.skills} />
              </SectionCard>

              <SectionCard title="Experience">
                {(structuredContent.experience ?? []).length === 0 ? (
                  <EmptyBlock message="No experience section generated." />
                ) : (
                  <div className="space-y-4">
                    {(structuredContent.experience ?? []).map(
                      (experience, index) => (
                        <div
                          key={`${experience.company}-${experience.role}-${index}`}
                          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
                        >
                          <h3 className="break-words font-semibold text-white">
                            {experience.role ?? "Role not specified"} —{" "}
                            {experience.company ?? "Company not specified"}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {experience.startDate ?? "Start"} –{" "}
                            {experience.endDate ?? "End"}
                          </p>

                          <div className="mt-4">
                            <BulletList
                              items={experience.bullets ?? []}
                              emptyText="No bullets generated for this experience."
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Projects">
                {(structuredContent.projects ?? []).length === 0 ? (
                  <EmptyBlock message="No projects section generated." />
                ) : (
                  <div className="space-y-4">
                    {(structuredContent.projects ?? []).map((project, index) => (
                      <div
                        key={`${project.name}-${index}`}
                        className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
                      >
                        <h3 className="break-words font-semibold text-white">
                          {project.name ?? "Project"}
                        </h3>

                        {project.description ? (
                          <p className="mt-2 break-words text-sm leading-6 text-slate-400">
                            {project.description}
                          </p>
                        ) : null}

                        {(project.technologies ?? []).length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(project.technologies ?? []).map((technology) => (
                              <Badge key={technology} variant="blue">
                                {technology}
                              </Badge>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-4">
                          <BulletList
                            items={project.bullets ?? []}
                            emptyText="No bullets generated for this project."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <section className="grid gap-6 xl:grid-cols-2">
                <SectionCard title="Certifications">
                  <BulletList
                    items={structuredContent.certifications ?? []}
                    emptyText="No certifications generated."
                  />
                </SectionCard>

                <SectionCard title="Achievements">
                  <BulletList
                    items={structuredContent.achievements ?? []}
                    emptyText="No achievements generated."
                  />
                </SectionCard>
              </section>

<SectionCard title="Education">
  {(structuredContent.education ?? []).length === 0 ? (
    <EmptyBlock message="No education section generated." />
  ) : (
    <div className="space-y-4">
      {(structuredContent.education ?? []).map((education, index) => {
        if (typeof education === "string") {
          return (
            <div
              key={`${education}-${index}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <p className="break-words text-sm leading-6 text-slate-300">
                {education}
              </p>
            </div>
          );
        }

        return (
          <div
            key={`${education.institution}-${index}`}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
          >
            <h3 className="break-words font-semibold text-white">
              {education.degree ?? "Degree"}
              {education.field ? ` in ${education.field}` : ""}
            </h3>

            <p className="mt-1 break-words text-sm text-slate-400">
              {education.institution ?? "Institution not specified"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {education.startDate ?? "Start"} – {education.endDate ?? "End"}
            </p>

            {education.description ? (
              <p className="mt-4 break-words text-sm leading-6 text-slate-300">
                {education.description}
              </p>
            ) : null}

            <div className="mt-4">
              <BulletList
                items={education.details ?? []}
                emptyText="No education details generated."
              />
            </div>
          </div>
        );
      })}
    </div>
  )}
</SectionCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}