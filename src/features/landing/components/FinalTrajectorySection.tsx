import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  FileSearch,
  FileText,
  GitBranch,
  GraduationCap,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { APP_ROUTES } from "../../../lib/constants";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const snakePath =
  "M 70 180 C 170 60, 260 60, 360 165 S 550 260, 650 130 S 820 20, 930 120 S 1010 220, 1040 80";

const milestones = [
  {
    label: "You",
    icon: Target,
    tone: "slate",
  },
  {
    label: "Skills",
    icon: GraduationCap,
    tone: "blue",
  },
  {
    label: "JD",
    icon: FileSearch,
    tone: "violet",
  },
  {
    label: "Resume",
    icon: FileText,
    tone: "green",
  },
  {
    label: "ATS",
    icon: ShieldCheck,
    tone: "amber",
  },
  {
    label: "GitHub",
    icon: GitBranch,
    tone: "slate",
  },
  {
    label: "Applications",
    icon: BriefcaseBusiness,
    tone: "blue",
  },
  {
    label: "Offer",
    icon: Trophy,
    tone: "green",
  },
];

const milestonePositions = [
  { x: 70, y: 180 },
  { x: 215, y: 74 },
  { x: 360, y: 165 },
  { x: 505, y: 230 },
  { x: 650, y: 130 },
  { x: 790, y: 58 },
  { x: 930, y: 120 },
  { x: 1040, y: 80 },
];

function getToneClass(tone: string) {
  if (tone === "blue") {
    return "border-brand-500/30 bg-brand-500/10 text-brand-300";
  }

  if (tone === "green") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (tone === "violet") {
    return "border-violet-500/30 bg-violet-500/10 text-violet-300";
  }

  if (tone === "amber") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }

  return "border-slate-700 bg-slate-900 text-slate-300";
}

export function FinalTrajectorySection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="blue">Final trajectory</Badge>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Don’t just apply. Become ready.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400">
            OfferPilot helps you understand where you are, where you need to go,
            and exactly what you should do next to get there.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <div className="relative hidden h-[260px] lg:block">
            <svg
              viewBox="0 0 1100 260"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="Final career trajectory from current state to offer"
            >
              <defs>
                <linearGradient
                  id="finalTrajectoryGradient"
                  x1="0"
                  x2="1"
                  y1="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="35%" stopColor="#6366f1" />
                  <stop offset="70%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>

                <filter id="finalTrajectoryGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d={snakePath}
                fill="none"
                stroke="#1e293b"
                strokeWidth="18"
                strokeLinecap="round"
              />

              <path
                d={snakePath}
                fill="none"
                stroke="url(#finalTrajectoryGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#finalTrajectoryGlow)"
                strokeDasharray="1400"
                strokeDashoffset="0"
              />

              {!prefersReducedMotion ? (
                <>
                  <circle r="5" fill="#ffffff" filter="url(#finalTrajectoryGlow)">
                    <animateMotion
                      dur="6s"
                      repeatCount="indefinite"
                      path={snakePath}
                    />
                  </circle>

                  <circle r="4" fill="#10b981" opacity="0.9">
                    <animateMotion
                      dur="8s"
                      repeatCount="indefinite"
                      begin="1.2s"
                      path={snakePath}
                    />
                  </circle>
                </>
              ) : null}
            </svg>

            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const position = milestonePositions[index];

              return (
                <div
                  key={milestone.label}
                  className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{
                    left: `${(position.x / 1100) * 100}%`,
                    top: `${(position.y / 260) * 100}%`,
                  }}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border backdrop-blur ${getToneClass(
                      milestone.tone
                    )}`}
                  >
                    <Icon size={21} />
                  </div>

                  <p className="mt-3 whitespace-nowrap text-xs font-medium text-slate-400">
                    {milestone.label}
                  </p>

                  <span className="mt-1 text-[10px] text-slate-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 lg:hidden">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;

              return (
                <div
                  key={milestone.label}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${getToneClass(
                      milestone.tone
                    )}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {milestone.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={APP_ROUTES.SIGNUP}>
            <Button size="lg">
              Start your journey
              <ArrowRight size={17} />
            </Button>
          </Link>

          <Link to={APP_ROUTES.LOGIN}>
            <Button size="lg" variant="secondary">
              Sign in
              <Code2 size={17} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}