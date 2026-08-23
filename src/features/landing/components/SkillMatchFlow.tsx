import { Badge } from "../../../components/ui/badge";

const resumeSkills = ["Java", "Spring Boot", "SQL", "REST API", "React"];
const jdRequirements = [
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "Redis",
  "Kafka",
  "REST API",
];

const matched = ["Java", "Spring Boot", "REST API"];
const missing = ["PostgreSQL", "Redis", "Kafka"];

function isMatched(skill: string) {
  return matched.includes(skill);
}

function isMissing(skill: string) {
  return missing.includes(skill);
}

export function SkillMatchFlow() {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Demo JD comparison
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            A job description becomes a requirement map
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="green">Matched</Badge>
          <Badge variant="red">Missing</Badge>
          <Badge variant="amber">Important</Badge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_120px_1fr] lg:items-center">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm font-semibold text-white">Resume Signals</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {resumeSkills.map((skill) => (
              <Badge
                key={skill}
                variant={isMatched(skill) ? "green" : "slate"}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="hidden justify-center lg:flex">
          <div className="h-px w-full bg-gradient-to-r from-slate-800 via-brand-500 to-slate-800" />
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm font-semibold text-white">Target JD</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {jdRequirements.map((skill) => (
              <Badge
                key={skill}
                variant={
                  isMatched(skill)
                    ? "green"
                    : isMissing(skill)
                      ? "red"
                      : "amber"
                }
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
          <p className="text-sm font-semibold text-emerald-200">
            Matched Skills
          </p>

          <p className="mt-2 text-sm leading-6 text-emerald-100/80">
            Java, Spring Boot and REST API are already supported by the resume
            signals.
          </p>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
          <p className="text-sm font-semibold text-red-200">Missing Skills</p>

          <p className="mt-2 text-sm leading-6 text-red-100/80">
            Redis, Kafka and PostgreSQL are separated as gaps, not silently added
            to the resume.
          </p>
        </div>
      </div>
    </div>
  );
}