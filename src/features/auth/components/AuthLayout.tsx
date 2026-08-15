import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { APP_NAME, APP_ROUTES } from "../../../lib/constants";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-surface-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-slate-800 bg-slate-950 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.18),transparent_30%)]" />

          <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
            <Link to={APP_ROUTES.HOME} className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 shadow-glow">
                <Sparkles size={21} />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-tight">
                  {APP_NAME}
                </p>
                <p className="text-xs text-slate-500">Career execution OS</p>
              </div>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-300">
                Built for focused job-switch preparation
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-white xl:text-5xl">
                Know exactly what to do today to move closer to your target offer.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
                OfferPilot combines goals, learning, applications, resume
                tracking and daily execution into one focused dashboard.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-semibold">42%</p>
                  <p className="mt-1 text-xs text-slate-500">Goal progress</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-semibold">7</p>
                  <p className="mt-1 text-xs text-slate-500">Tasks this week</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-semibold">12</p>
                  <p className="mt-1 text-xs text-slate-500">Applications</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Designed for serious software engineers preparing with intent.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <Link to={APP_ROUTES.HOME} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 shadow-glow">
                  <Sparkles size={21} />
                </div>

                <div>
                  <p className="text-lg font-semibold tracking-tight">
                    {APP_NAME}
                  </p>
                  <p className="text-xs text-slate-500">Career execution OS</p>
                </div>
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-premium backdrop-blur-xl sm:p-8">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </div>

              <div className="mt-7">{children}</div>
            </div>

            {footer ? (
              <div className="mt-6 text-center text-sm text-slate-400">
                {footer}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}