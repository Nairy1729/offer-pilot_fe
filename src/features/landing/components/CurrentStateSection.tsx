import { Badge } from "../../../components/ui/badge";
import { SkillGraph } from "./SkillGraph";

export function CurrentStateSection() {
  return (
    <section className="border-b border-slate-900 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <Badge variant="blue">Chapter 01 · Current State</Badge>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Before you decide where to go, know where you are.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-400">
            OfferPilot treats your current skills as a connected system. Strong
            skills, working knowledge and gaps become visible before you plan the
            next move.
          </p>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm font-medium text-white">
              Demo visualization
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This graph uses sample data to demonstrate how OfferPilot can
              represent readiness. It is not analyzing the visitor.
            </p>
          </div>
        </div>

        <SkillGraph />
      </div>
    </section>
  );
}