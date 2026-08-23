import { Link } from "react-router-dom";
import { ArrowRight, ListChecks } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { APP_ROUTES } from "../../../lib/constants";
import { LandingNav } from "../components/LandingNav";
import { HeroSection } from "../components/HeroSection";
import { landingDemoMission } from "../data/landingPageDemoData";
import { CurrentStateSection } from "../components/CurrentStateSection";
import { JDAnalyzerShowcase } from "../components/JDAnalyzerShowcase";
import { ResumeTransformationSection } from "../components/ResumeTransformationSection";
import { EvidenceSignalsSection } from "../components/EvidenceSignalsSection";
import { ApplicationJourneySection } from "../components/ApplicationJourneySection";
import { GoalEngineSection } from "../components/GoalEngineSection";
import { RevealSection } from "../components/RevealSection";
import { FinalTrajectorySection } from "../components/FinalTrajectorySection";
import { GreetingMonkey } from "../components/GreetingMonkey";

function IntelligenceTransitionSection() {
  return (
    <section
      id="intelligence"
      className="border-b border-slate-900 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl text-center">
        <Badge variant="violet">OfferPilot intelligence layer</Badge>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Everything connects into one career operating system.
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-400">
          Your profile, resume, job descriptions, learning progress, evidence
          signals and applications should not live in separate tools. OfferPilot
          connects them into one trajectory.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-premium">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Input
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Profile + Resume + JD
            </p>
          </div>

          <div className="rounded-3xl border border-brand-500/20 bg-brand-500/10 p-5 shadow-premium">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-300">
              Intelligence
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Gap + Readiness Engine
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 shadow-premium">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
              Output
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Today’s Mission
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TodayMissionSection() {
  return (
    <section
      id="mission"
      className="border-b border-slate-900 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Badge variant="green">Today’s Mission</Badge>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Not another roadmap. A plan that changes with you.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-400">
            OfferPilot’s direction is simple: translate your target offer into
            the highest-impact actions you should complete today.
          </p>

          <Link to={APP_ROUTES.SIGNUP}>
            <Button className="mt-8" size="lg">
              Build my path
              <ArrowRight size={17} />
            </Button>
          </Link>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Demo mission
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                What should I do today?
              </h3>
            </div>

            <Badge variant="amber">2h 30m</Badge>
          </div>

          <div className="mt-6 space-y-3">
            {landingDemoMission.map((task, index) => (
              <div
                key={task.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-sm font-semibold text-brand-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-white">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {task.duration} · {task.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button className="mt-6 w-full">
            <ListChecks size={16} />
            Start today
          </Button>
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-surface-950 text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10">
        <GreetingMonkey />
        <LandingNav />

        <HeroSection />

        <RevealSection>
          <CurrentStateSection />
        </RevealSection>

        <RevealSection>
          <JDAnalyzerShowcase />
        </RevealSection>

        <RevealSection>
          <ResumeTransformationSection />
        </RevealSection>

        <RevealSection>
          <EvidenceSignalsSection />
        </RevealSection>

        <RevealSection>
          <GoalEngineSection />
        </RevealSection>

        <RevealSection>
          <IntelligenceTransitionSection />
        </RevealSection>

        <RevealSection>
          <TodayMissionSection />
        </RevealSection>

        <RevealSection>
          <ApplicationJourneySection />
        </RevealSection>

        <RevealSection>
          <FinalTrajectorySection />
        </RevealSection>
      </div>
    </main>
  );
}