import {
  ArrowRight,
  BrainCircuit,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";

const keywordFlows = [
  {
    keyword: "Spring Boot",
    target: "Experience",
    tone: "green",
  },
  {
    keyword: "REST API",
    target: "Projects",
    tone: "blue",
  },
  {
    keyword: "PostgreSQL",
    target: "Skills",
    tone: "violet",
  },
  {
    keyword: "Docker",
    target: "Projects",
    tone: "amber",
  },
];

function getToneClass(tone: string) {
  if (tone === "green") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
  }

  if (tone === "blue") {
    return "border-brand-500/20 bg-brand-500/10 text-brand-200";
  }

  if (tone === "violet") {
    return "border-violet-500/20 bg-violet-500/10 text-violet-200";
  }

  return "border-amber-500/20 bg-amber-500/10 text-amber-200";
}

export function ResumeTransformationSection() {
  return (
    <section className="border-b border-slate-900 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Badge variant="green">Chapter 03 · Tailor Resume</Badge>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Your resume should adapt to the role without inventing experience.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-400">
            OfferPilot uses the analyzed JD and your uploaded master resume to
            generate a truthful draft. Matched skills are emphasized. Missing
            skills stay visible as gaps.
          </p>

          <div className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
            <p className="text-sm font-semibold text-amber-200">
              Truthfulness guardrail
            </p>
            <p className="mt-2 text-sm leading-6 text-amber-100/80">
              Unsupported skills are not silently added to the resume. They are
              shown separately as missing requirements.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Demo resume transformation
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">
                JD signals move into supported resume sections
              </h3>
            </div>

            <Badge variant="blue">Alignment, not fabrication</Badge>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex items-center gap-3">
                <FileText size={19} className="text-slate-400" />
                <p className="font-semibold text-white">Original Resume</p>
              </div>

              <div className="mt-5 space-y-3">
                <div className="h-3 w-4/5 rounded bg-slate-800" />
                <div className="h-3 w-2/3 rounded bg-slate-800" />
                <div className="h-3 w-5/6 rounded bg-slate-800" />
                <div className="h-3 w-3/5 rounded bg-slate-800" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="slate">Java</Badge>
                <Badge variant="slate">SQL</Badge>
                <Badge variant="slate">REST</Badge>
              </div>
            </div>

            <div className="hidden items-center justify-center lg:flex">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-brand-300">
                <ArrowRight size={21} />
              </div>
            </div>

            <div className="rounded-3xl border border-brand-500/20 bg-brand-500/10 p-5">
              <div className="flex items-center gap-3">
                <BrainCircuit size={19} className="text-brand-300" />
                <p className="font-semibold text-white">Tailored Draft</p>
              </div>

              <div className="mt-5 space-y-3">
                <div className="h-3 w-5/6 rounded bg-brand-400/30" />
                <div className="h-3 w-4/5 rounded bg-brand-400/30" />
                <div className="h-3 w-2/3 rounded bg-brand-400/30" />
                <div className="h-3 w-3/4 rounded bg-brand-400/30" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="green">Spring Boot</Badge>
                <Badge variant="green">REST API</Badge>
                <Badge variant="green">PostgreSQL</Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {keywordFlows.map((flow) => (
              <div
                key={flow.keyword}
                className={`rounded-2xl border p-4 ${getToneClass(flow.tone)}`}
              >
                <p className="text-sm font-semibold">{flow.keyword}</p>
                <p className="mt-1 text-xs opacity-80">
                  Routed to {flow.target}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck size={19} className="text-emerald-300" />
              <p className="text-sm font-semibold text-white">
                ATS alignment preview
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Original</p>
                <p className="mt-1 text-2xl font-semibold text-slate-300">
                  68%
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Tailored</p>
                <p className="mt-1 text-2xl font-semibold text-brand-300">
                  79%
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">After review</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-300">
                  91%
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Demo only. This represents improved alignment with a job
              description, not a hiring guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}