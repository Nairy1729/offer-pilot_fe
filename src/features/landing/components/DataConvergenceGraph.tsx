import {
  Binary,
  BookOpenCheck,
  BriefcaseBusiness,
  Code2,
  FileSearch,
  FileText,
  GitBranch,
  Target,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";

const sources = [
  {
    id: "profile",
    label: "Profile",
    description: "Role, experience, location",
    icon: BriefcaseBusiness,
    x: 105,
    y: 85,
    tone: "blue",
  },
  {
    id: "resume",
    label: "Resume",
    description: "Skills and evidence",
    icon: FileText,
    x: 105,
    y: 260,
    tone: "green",
  },
  {
    id: "jd",
    label: "Job Description",
    description: "Target requirements",
    icon: FileSearch,
    x: 395,
    y: 45,
    tone: "violet",
  },
  {
    id: "github",
    label: "GitHub",
    description: "Build signals",
    icon: GitBranch,
    x: 675,
    y: 85,
    tone: "slate",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    description: "Practice signals",
    icon: Code2,
    x: 675,
    y: 260,
    tone: "amber",
  },
  {
    id: "learning",
    label: "Learning",
    description: "Progress and gaps",
    icon: BookOpenCheck,
    x: 395,
    y: 315,
    tone: "green",
  },
];

const outputSteps = [
  {
    label: "Current State",
    description: "What you already have",
  },
  {
    label: "Skill Gap",
    description: "What is missing",
  },
  {
    label: "Roadmap",
    description: "What to build",
  },
  {
    label: "Today's Mission",
    description: "What to do now",
  },
];

function getToneClasses(tone: string) {
  if (tone === "blue") {
    return {
      node: "border-brand-500/30 bg-brand-500/10 text-brand-200",
      icon: "text-brand-300",
    };
  }

  if (tone === "green") {
    return {
      node: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
      icon: "text-emerald-300",
    };
  }

  if (tone === "violet") {
    return {
      node: "border-violet-500/30 bg-violet-500/10 text-violet-200",
      icon: "text-violet-300",
    };
  }

  if (tone === "amber") {
    return {
      node: "border-amber-500/30 bg-amber-500/10 text-amber-200",
      icon: "text-amber-300",
    };
  }

  return {
    node: "border-slate-700 bg-slate-900 text-slate-300",
    icon: "text-slate-300",
  };
}

export function DataConvergenceGraph() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Concept preview
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Many signals, one goal engine
          </h3>
        </div>

        <Badge variant="violet">Future Goal Engine</Badge>
      </div>

      <div className="relative hidden h-[420px] lg:block">
        <svg
          viewBox="0 0 780 420"
          aria-label="Data sources converge toward goal engine"
          role="img"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="convergeLine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="55%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {sources.map((source) => (
            <line
              key={source.id}
              x1={source.x}
              y1={source.y}
              x2={390}
              y2={200}
              stroke="url(#convergeLine)"
              strokeWidth="2"
              strokeOpacity="0.7"
              strokeDasharray="5 7"
            />
          ))}

          <circle
            cx="390"
            cy="200"
            r="66"
            fill="#111827"
            stroke="#6366f1"
            strokeWidth="2"
          />

          <circle
            cx="390"
            cy="200"
            r="92"
            fill="none"
            stroke="#6366f1"
            strokeOpacity="0.16"
            strokeWidth="2"
          />

          <text
            x="390"
            y="194"
            textAnchor="middle"
            className="fill-white text-[18px] font-semibold"
          >
            GOAL
          </text>

          <text
            x="390"
            y="218"
            textAnchor="middle"
            className="fill-slate-500 text-[12px]"
          >
            intelligence layer
          </text>

          <line
            x1="390"
            y1="266"
            x2="390"
            y2="395"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="5 7"
          />
        </svg>

        {sources.map((source) => {
          const Icon = source.icon;
          const tone = getToneClasses(source.tone);

          return (
            <div
              key={source.id}
              className={`absolute w-36 rounded-2xl border p-3 ${tone.node}`}
              style={{
                left: source.x - 72,
                top: source.y - 38,
              }}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className={tone.icon} />
                <p className="text-sm font-semibold text-white">
                  {source.label}
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {source.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 lg:hidden">
        {sources.map((source) => {
          const Icon = source.icon;
          const tone = getToneClasses(source.tone);

          return (
            <div
              key={source.id}
              className={`rounded-2xl border p-4 ${tone.node}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className={tone.icon} />
                <p className="text-sm font-semibold text-white">
                  {source.label}
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {source.description}
              </p>
            </div>
          );
        })}

        <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-5 text-center">
          <Target size={22} className="mx-auto text-brand-300" />
          <p className="mt-3 font-semibold text-white">Goal Engine</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {outputSteps.map((step, index) => (
          <div
            key={step.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-slate-500">
                {String(index + 1).padStart(2, "0")}
              </p>

              <Binary size={15} className="text-brand-300" />
            </div>

            <p className="mt-3 text-sm font-semibold text-white">
              {step.label}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}