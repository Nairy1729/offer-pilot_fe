import { Badge } from "../../../components/ui/badge";
import { SkillMatchFlow } from "./SkillMatchFlow";

export function JDAnalyzerShowcase() {
  return (
    <section className="border-b border-slate-900 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div>
          <Badge variant="violet">Chapter 02 · JD Analyzer</Badge>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            A job description is not a wall of text. It is a requirement graph.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-400">
            OfferPilot extracts required skills, preferred skills,
            responsibilities, qualifications and keywords so you can understand
            what the role really expects.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-medium text-white">
                It finds alignment
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Skills already supported by your resume are identified clearly.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-medium text-white">
                It protects truthfulness
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Missing requirements are shown as gaps instead of being
                fabricated.
              </p>
            </div>
          </div>
        </div>

        <SkillMatchFlow />
      </div>
    </section>
  );
}