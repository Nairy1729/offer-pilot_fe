import { Badge } from "../../../components/ui/badge";
import type { DemoTarget } from "../data/landingPageDemoData";

type TargetSelectorProps = {
  targets: DemoTarget[];
  selectedTarget: DemoTarget;
  onSelectTarget: (target: DemoTarget) => void;
};

export function TargetSelector({
  targets,
  selectedTarget,
  onSelectTarget,
}: TargetSelectorProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-3 shadow-premium">
      <div className="mb-3 flex items-center justify-between gap-3 px-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Demo target
        </p>

        <Badge variant="blue">Interactive</Badge>
      </div>

      <div className="grid gap-2">
        {targets.map((target) => {
          const isActive = target.id === selectedTarget.id;

          return (
            <button
              key={target.id}
              type="button"
              onClick={() => onSelectTarget(target)}
              aria-pressed={isActive}
              className={`rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-brand-500/60 ${
                isActive
                  ? "border-brand-500/50 bg-brand-500/15 text-white"
                  : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-sm font-semibold">
                  {target.label}
                </p>

                <p className="shrink-0 text-xs text-slate-500">
                  {target.salaryLabel}
                </p>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  variant={
                    target.difficulty === "Advanced"
                      ? "red"
                      : target.difficulty === "Intermediate"
                        ? "amber"
                        : "green"
                  }
                >
                  {target.difficulty}
                </Badge>

                <span className="text-xs text-slate-500">
                  {target.estimatedTimeline}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}