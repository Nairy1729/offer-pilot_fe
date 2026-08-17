import {
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Code2,
  FileText,
  Flame,
  Target,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { SectionCard } from "../../../components/common/SectionCard";
import { StatCard } from "../../../components/common/StatCard";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

const todayTasks = [
  {
    title: "Solve 2 medium DSA problems",
    category: "DSA",
    priority: "High",
    time: "90 min",
    color: "blue",
  },
  {
    title: "Revise Spring Security JWT flow",
    category: "Spring Boot",
    priority: "High",
    time: "60 min",
    color: "violet",
  },
  {
    title: "Apply to 3 backend engineer roles",
    category: "Applications",
    priority: "Medium",
    time: "45 min",
    color: "amber",
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Today&apos;s command center"
        title="What should you do today?"
        description="Your highest-impact actions across learning, applications and interview preparation."
        action={
          <Button>
            <CheckCircle2 size={18} />
            Complete focus session
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Preparation progress"
          value="42%"
          description="Overall v1 readiness"
          icon={<Target size={20} />}
          trend="+8% this week"
        />

        <StatCard
          title="DSA completed"
          value="38"
          description="Problems solved"
          icon={<Code2 size={20} />}
          trend="+6 problems"
        />

        <StatCard
          title="Applications"
          value="12"
          description="Active job pipeline"
          icon={<BriefcaseBusiness size={20} />}
          trend="+3 this week"
        />

        <StatCard
          title="Study streak"
          value="7 days"
          description="Consistency score"
          icon={<Flame size={20} />}
          trend="Keep going"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionCard
          title="Today&apos;s focus tasks"
          description="Complete these tasks first. They are selected to maximize your offer probability."
          action={<Badge variant="green">3 tasks</Badge>}
        >
          <div className="space-y-4">
            {todayTasks.map((task, index) => (
              <div
                key={task.title}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-600 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-semibold text-brand-300">
                    {index + 1}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          task.priority === "High" ? "red" : "amber"
                        }
                      >
                        {task.priority}
                      </Badge>
                      <Badge variant="slate">{task.category}</Badge>
                    </div>

                    <h3 className="mt-3 font-semibold text-white">
                      {task.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Estimated time: {task.time}
                    </p>
                  </div>
                </div>

                <Button variant="secondary" size="sm">
                  Mark done
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Goal progress"
          description="Your current preparation readiness."
        >
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">Overall progress</span>
                <span className="font-medium text-white">42%</span>
              </div>
              <Progress value={42} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">Spring Boot</span>
                <span className="font-medium text-white">56%</span>
              </div>
              <Progress value={56} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">System Design</span>
                <span className="font-medium text-white">28%</span>
              </div>
              <Progress value={28} />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
              <BookOpenCheck size={20} />
            </div>

            <div>
              <h3 className="font-semibold">Learning momentum</h3>
              <p className="text-sm text-slate-500">
                DSA and Spring Boot are moving well.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
              <CalendarDays size={20} />
            </div>

            <div>
              <h3 className="font-semibold">Upcoming interviews</h3>
              <p className="text-sm text-slate-500">
                No interviews scheduled yet.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
              <FileText size={20} />
            </div>

            <div>
              <h3 className="font-semibold">Resume status</h3>
              <p className="text-sm text-slate-500">
                Active backend resume missing.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}