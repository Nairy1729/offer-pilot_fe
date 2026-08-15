export function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <section className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-medium text-blue-400">Today’s focus</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            What should you do today?
          </h1>

          <p className="mt-2 text-slate-400">
            Your highest-impact tasks to move closer to your target offer.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Priority Task</p>
            <h2 className="mt-3 text-xl font-semibold">
              Solve 2 medium DSA problems
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Estimated time: 90 minutes
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Spring Boot</p>
            <h2 className="mt-3 text-xl font-semibold">
              Revise Spring Security JWT flow
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Estimated time: 60 minutes
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Applications</p>
            <h2 className="mt-3 text-xl font-semibold">
              Apply to 3 backend roles
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Estimated time: 45 minutes
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}