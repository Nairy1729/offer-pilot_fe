import { Badge } from "../../../components/ui/badge";
import { DataConvergenceGraph } from "./DataConvergenceGraph";

export function GoalEngineSection() {
  return (
    <section className="border-b border-slate-900 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
        <div className="max-w-xl">
  <Badge variant="violet">Chapter 05 · Intelligence Layer</Badge>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            All signals should point toward one thing: the next right action.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-400">
            Your profile, resume, job descriptions, learning progress,
            applications and future evidence signals should not live in separate
            tools. OfferPilot connects them around your target offer.
          </p>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm font-medium text-white">
              Goal Engine concept
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This section demonstrates the planned intelligence layer using
              frontend demo data. It does not call any external API.
            </p>
          </div>
        </div>

        <DataConvergenceGraph />
      </div>
    </section>
  );
}