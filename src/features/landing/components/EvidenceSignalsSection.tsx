import { Badge } from "../../../components/ui/badge";

const contributionRows = [
  [0, 1, 2, 0, 3, 1, 0, 2, 4, 3, 1, 0],
  [1, 0, 2, 3, 4, 2, 1, 0, 3, 4, 2, 1],
  [0, 2, 3, 4, 2, 1, 0, 1, 2, 3, 4, 2],
  [2, 3, 1, 0, 1, 2, 3, 4, 3, 1, 0, 2],
];

const leetcodeTopics = [
  {
    label: "Arrays",
    progress: 82,
  },
  {
    label: "Trees",
    progress: 58,
  },
  {
    label: "Graphs",
    progress: 42,
  },
  {
    label: "DP",
    progress: 34,
  },
  {
    label: "Sliding Window",
    progress: 76,
  },
];

function getContributionColor(value: number) {
  if (value === 0) {
    return "bg-slate-800";
  }

  if (value === 1) {
    return "bg-emerald-900";
  }

  if (value === 2) {
    return "bg-emerald-700";
  }

  if (value === 3) {
    return "bg-emerald-500";
  }

  return "bg-emerald-300";
}

export function EvidenceSignalsSection() {
  return (
    <section className="border-b border-slate-900 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Badge variant="blue">Chapter 04 · Evidence Signals</Badge>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Your profile is more than what you claim. It is what you build and
            practice.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-400">
            Future OfferPilot signals can connect GitHub activity and coding
            practice to your preparation map. These are evidence signals, not
            absolute proof of skill.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Concept preview
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  GitHub activity signal
                </h3>
              </div>

              <Badge variant="green">Future signal</Badge>
            </div>

            <div className="mt-6 grid gap-2">
              {contributionRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  {row.map((value, index) => (
                    <div
                      key={`${rowIndex}-${index}`}
                      className={`h-5 w-5 rounded-md ${getContributionColor(
                        value
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-500">Repositories</p>
                <p className="mt-1 text-2xl font-semibold text-white">6</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-500">Languages</p>
                <p className="mt-1 text-2xl font-semibold text-white">4</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-500">Recent activity</p>
                <p className="mt-1 text-2xl font-semibold text-white">18</p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">
              Demo visualization. GitHub integration is planned and not active on
              this page.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Concept preview
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  Coding practice topology
                </h3>
              </div>

              <Badge variant="violet">Future signal</Badge>
            </div>

            <div className="mt-6 space-y-4">
              {leetcodeTopics.map((topic) => (
                <div key={topic.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">
                      {topic.label}
                    </p>
                    <p className="text-xs text-slate-500">{topic.progress}%</p>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
                      style={{
                        width: `${topic.progress}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs leading-5 text-slate-500">
              Demo visualization. LeetCode activity is an evidence signal, not a
              complete measure of engineering ability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}