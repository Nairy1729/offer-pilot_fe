import {
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  FileText,
  Send,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";

const stages = [
  {
    label: "Discover",
    description: "Find a role worth targeting.",
    icon: Target,
  },
  {
    label: "Analyze JD",
    description: "Extract requirements and gaps.",
    icon: FileSearch,
  },
  {
    label: "Tailor Resume",
    description: "Align resume truthfully.",
    icon: FileText,
  },
  {
    label: "ATS Check",
    description: "Improve JD alignment.",
    icon: ShieldCheck,
  },
  {
    label: "Apply",
    description: "Track the application.",
    icon: Send,
  },
  {
    label: "OA",
    description: "Prepare for assessments.",
    icon: CheckCircle2,
  },
  {
    label: "Interview",
    description: "Focus on the next round.",
    icon: BriefcaseBusiness,
  },
  {
    label: "Offer",
    description: "Reach the destination.",
    icon: Trophy,
  },
];

export function ApplicationJourneySection() {
  return (
    <section className="border-b border-slate-900 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Badge variant="amber">Chapter 07 · Application Journey</Badge>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Preparation and applications should move together.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-400">
            OfferPilot connects job discovery, JD analysis, resume tailoring,
            application tracking and interview readiness into one continuous
            path.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage, index) => {
              const Icon = stage.icon;

              return (
                <div
                  key={stage.label}
                  className="relative rounded-3xl border border-slate-800 bg-slate-900/50 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                      <Icon size={20} />
                    </div>

                    <span className="text-xs font-medium text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {stage.label}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {stage.description}
                  </p>

                  {index < stages.length - 1 ? (
                    <div className="pointer-events-none absolute right-[-18px] top-1/2 hidden h-px w-9 bg-gradient-to-r from-brand-500 to-transparent xl:block" />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm font-medium text-white">
              The goal is not to apply more randomly.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The goal is to become increasingly ready for the roles you choose
              to pursue.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}