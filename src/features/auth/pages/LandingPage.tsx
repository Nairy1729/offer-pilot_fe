import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ClipboardList,
  Sparkles,
  Target,
} from "lucide-react";
import { APP_DESCRIPTION, APP_NAME, APP_ROUTES } from "../../../lib/constants";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

const features = [
  {
    title: "Daily focus plan",
    description:
      "Know exactly what to do today across DSA, Spring Boot, system design and applications.",
    icon: Target,
  },
  {
    title: "Preparation tracker",
    description:
      "Track your learning progress, weak areas, revision queue and career preparation habits.",
    icon: ClipboardList,
  },
  {
    title: "Application visibility",
    description:
      "Manage applied roles, interviews, follow-ups and offer pipeline without losing context.",
    icon: BarChart3,
  },
];

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-950 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to={APP_ROUTES.HOME} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-glow">
            <Sparkles size={20} />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#workflow" className="transition hover:text-white">
            Workflow
          </a>
          <Link to={APP_ROUTES.LOGIN} className="transition hover:text-white">
            Login
          </Link>
        </nav>

        <Link to={APP_ROUTES.SIGNUP}>
          <Button size="sm">Get started</Button>
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
        <div>
          <Badge variant="blue" className="mb-6">
            OfferPilot v1 is focused on daily execution
          </Badge>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Turn job preparation into a{" "}
            <span className="text-gradient">daily operating system.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {APP_DESCRIPTION} Every day, OfferPilot helps you decide what action
            gives you the highest chance of reaching your target offer.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to={APP_ROUTES.SIGNUP}>
              <Button size="lg">
                Start building
                <ArrowRight size={18} />
              </Button>
            </Link>

            <Link to={APP_ROUTES.LOGIN}>
              <Button variant="secondary" size="lg">
                View demo dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              No AI noise
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              Execution-first
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              Resume-worthy
            </div>
          </div>
        </div>

        <Card className="relative overflow-hidden p-4 shadow-premium">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Today&apos;s mission</p>
                <h2 className="mt-1 text-xl font-semibold">
                  Maximize offer probability
                </h2>
              </div>

              <Badge variant="green">On track</Badge>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="text-xs font-medium text-blue-300">
                  High impact
                </p>
                <h3 className="mt-2 font-semibold">
                  Solve 2 medium DSA problems
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Builds interview readiness for product companies.
                </p>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                <p className="text-xs font-medium text-violet-300">
                  Backend depth
                </p>
                <h3 className="mt-2 font-semibold">
                  Revise Spring Security JWT flow
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Strengthens your core Spring Boot interview answers.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-xs font-medium text-amber-300">
                  Job pipeline
                </p>
                <h3 className="mt-2 font-semibold">
                  Apply to 3 backend engineer roles
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Keeps your opportunity pipeline moving.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8">
          <p className="text-sm font-medium text-brand-400">Why it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Built around action, not clutter.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <Card className="premium-gradient">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <Badge variant="violet">Product company mindset</Badge>

              <h2 className="mt-5 text-3xl font-bold tracking-tight">
                One question. Every day.
              </h2>

              <p className="mt-4 text-slate-300">
                OfferPilot v1 focuses on the most important question for a job
                switch candidate: what should I do today to maximize my chances
                of getting my target offer?
              </p>
            </div>

            <div className="grid gap-3">
              {[
                "Define your target role and salary.",
                "Track learning across DSA, Spring Boot and system design.",
                "Manage applications and upcoming interviews.",
                "Get a clear daily execution plan.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-slate-700/70 bg-slate-950/50 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}