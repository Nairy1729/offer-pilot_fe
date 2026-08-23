import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, MousePointer2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { APP_ROUTES } from "../../../lib/constants";
import { demoTargets } from "../data/landingPageDemoData";
import { CareerTrajectory } from "./CareerTrajectory";
import { TargetSelector } from "./TargetSelector";

export function HeroSection() {
  const [selectedTarget, setSelectedTarget] = useState(demoTargets[1]);

  return (
    <section
      id="trajectory"
      className="relative overflow-hidden border-b border-slate-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_28%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
        <div>
          <Badge variant="blue">The career operating system for engineers</Badge>

          <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your career is a trajectory.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            OfferPilot turns your goals, experience, resume, job descriptions,
            GitHub activity and coding practice into a personalized path toward
            your next offer.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to={APP_ROUTES.SIGNUP} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Start your journey
                <ArrowRight size={17} />
              </Button>
            </Link>

            <a
              href="#intelligence"
              className="w-full sm:w-auto"
              aria-label="Explore OfferPilot intelligence sections"
            >
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore OfferPilot
                <Compass size={17} />
              </Button>
            </a>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <MousePointer2 size={16} />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Try the demo target selector
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Change the target and watch the trajectory adjust. This is
                  frontend demo data, not visitor-specific analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <TargetSelector
              targets={demoTargets}
              selectedTarget={selectedTarget}
              onSelectTarget={setSelectedTarget}
            />
          </div>
        </div>

        <div className="min-w-0">
          <CareerTrajectory target={selectedTarget} />

          <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm font-medium text-white">
              Missing signals for this target
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTarget.missingSignals.map((signal) => (
                <Badge key={signal} variant="amber">
                  {signal}
                </Badge>
              ))}
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              {selectedTarget.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}