import { useMemo } from "react";
import { Badge } from "../../../components/ui/badge";
import type { DemoTarget } from "../data/landingPageDemoData";
import {
  createCubicBezierPath,
  cubicBezierPoint,
  type Point,
} from "../utils/bezier";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type CareerTrajectoryProps = {
  target: DemoTarget;
};

const p0: Point = {
  x: 70,
  y: 330,
};

const p3: Point = {
  x: 820,
  y: 90,
};

function getControlPoints(target: DemoTarget) {
  if (target.difficulty === "Advanced") {
    return {
      p1: {
        x: 210,
        y: 80,
      },
      p2: {
        x: 600,
        y: 430,
      },
    };
  }

  if (target.difficulty === "Intermediate") {
    return {
      p1: {
        x: 220,
        y: 110,
      },
      p2: {
        x: 610,
        y: 350,
      },
    };
  }

  return {
    p1: {
      x: 220,
      y: 180,
    },
    p2: {
      x: 610,
      y: 260,
    },
  };
}

export function CareerTrajectory({ target }: CareerTrajectoryProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const { path, milestones } = useMemo(() => {
    const controls = getControlPoints(target);

    const generatedPath = createCubicBezierPath(
      p0,
      controls.p1,
      controls.p2,
      p3
    );

    const generatedMilestones = target.milestones.map((milestone, index) => {
      const t = (index + 1) / (target.milestones.length + 1);
      const point = cubicBezierPoint(t, p0, controls.p1, controls.p2, p3);

      return {
        label: milestone,
        x: point.x,
        y: point.y,
      };
    });

    return {
      path: generatedPath,
      milestones: generatedMilestones,
    };
  }, [target]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/80 p-4 shadow-premium sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%)]" />

      <div className="relative mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Career trajectory simulation
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            {target.label}
          </h3>
        </div>

        <Badge
          variant={
            target.difficulty === "Advanced"
              ? "red"
              : target.difficulty === "Intermediate"
                ? "amber"
                : "green"
          }
        >
          {target.difficulty}
        </Badge>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 900 420"
          role="img"
          aria-label="Animated career trajectory from current state to target offer"
          className="h-[280px] w-full sm:h-[420px]"
        >
          <defs>
            <linearGradient id="trajectoryGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="45%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="softGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d={path}
            fill="none"
            stroke="#1e293b"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <path
            key={target.id}
            d={path}
            fill="none"
            stroke="url(#trajectoryGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            className={
              prefersReducedMotion
                ? ""
                : "animate-[dashReveal_1.4s_ease-out_forwards]"
            }
            strokeDasharray={prefersReducedMotion ? undefined : "1000"}
            strokeDashoffset={prefersReducedMotion ? undefined : "1000"}
          />

          <circle cx={p0.x} cy={p0.y} r="11" fill="#94a3b8" />
          <circle
            cx={p0.x}
            cy={p0.y}
            r="22"
            fill="none"
            stroke="#94a3b8"
            strokeOpacity="0.2"
          />

          <text
            x={p0.x}
            y={p0.y + 44}
            textAnchor="middle"
            className="fill-slate-400 text-[15px] font-medium"
          >
            YOU
          </text>

          <circle
            cx={p3.x}
            cy={p3.y}
            r="13"
            fill="#10b981"
            filter="url(#softGlow)"
          />
          <circle
            cx={p3.x}
            cy={p3.y}
            r="28"
            fill="none"
            stroke="#10b981"
            strokeOpacity="0.25"
          />

          <text
            x={p3.x}
            y={p3.y - 34}
            textAnchor="middle"
            className="fill-emerald-300 text-[15px] font-semibold"
          >
            TARGET OFFER
          </text>

          {milestones.map((milestone, index) => (
            <g key={`${target.id}-${milestone.label}`}>
              <circle
                cx={milestone.x}
                cy={milestone.y}
                r="8"
                fill="#0f172a"
                stroke="#6366f1"
                strokeWidth="3"
                className={
                  prefersReducedMotion
                    ? "opacity-100"
                    : "opacity-0 animate-[nodeReveal_0.5s_ease-out_forwards]"
                }
                style={{
                  animationDelay: prefersReducedMotion
                    ? undefined
                    : `${350 + index * 130}ms`,
                }}
              />

              <text
                x={milestone.x}
                y={milestone.y - 18}
                textAnchor="middle"
                className="fill-slate-300 text-[11px] font-medium sm:text-[13px]"
              >
                {milestone.label}
              </text>
            </g>
          ))}

          {!prefersReducedMotion ? (
            <>
              <circle r="5" fill="#ffffff" filter="url(#softGlow)">
                <animateMotion dur="4.5s" repeatCount="indefinite" path={path} />
              </circle>

              <circle r="3" fill="#10b981" opacity="0.85">
                <animateMotion
                  dur="6s"
                  repeatCount="indefinite"
                  begin="1s"
                  path={path}
                />
              </circle>
            </>
          ) : null}
        </svg>
      </div>

      <div className="relative grid gap-3 border-t border-slate-800 pt-5 sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-500">Estimated path</p>
          <p className="mt-1 text-sm font-medium text-white">
            {target.estimatedTimeline}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Target band</p>
          <p className="mt-1 text-sm font-medium text-white">
            {target.salaryLabel}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Trajectory adapts by</p>
          <p className="mt-1 text-sm font-medium text-white">
            Skill gaps + readiness
          </p>
        </div>
      </div>
    </div>
  );
}