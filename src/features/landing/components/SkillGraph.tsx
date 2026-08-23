import { Badge } from "../../../components/ui/badge";

type SkillNode = {
  id: string;
  label: string;
  level: "strong" | "working" | "gap";
  x: number;
  y: number;
};

const nodes: SkillNode[] = [
  {
    id: "dotnet",
    label: ".NET",
    level: "strong",
    x: 130,
    y: 160,
  },
  {
    id: "csharp",
    label: "C#",
    level: "strong",
    x: 245,
    y: 90,
  },
  {
    id: "sql",
    label: "SQL",
    level: "strong",
    x: 370,
    y: 160,
  },
  {
    id: "react",
    label: "React",
    level: "working",
    x: 245,
    y: 240,
  },
  {
    id: "java",
    label: "Java",
    level: "working",
    x: 500,
    y: 95,
  },
  {
    id: "spring",
    label: "Spring Boot",
    level: "working",
    x: 625,
    y: 170,
  },
  {
    id: "redis",
    label: "Redis",
    level: "gap",
    x: 520,
    y: 260,
  },
  {
    id: "kafka",
    label: "Kafka",
    level: "gap",
    x: 695,
    y: 285,
  },
];

const edges = [
  ["dotnet", "csharp"],
  ["dotnet", "sql"],
  ["csharp", "sql"],
  ["sql", "react"],
  ["sql", "java"],
  ["java", "spring"],
  ["spring", "redis"],
  ["spring", "kafka"],
  ["redis", "kafka"],
];

function getNodeColor(level: SkillNode["level"]) {
  if (level === "strong") {
    return {
      fill: "#10b981",
      stroke: "#34d399",
      badge: "green" as const,
    };
  }

  if (level === "working") {
    return {
      fill: "#6366f1",
      stroke: "#818cf8",
      badge: "blue" as const,
    };
  }

  return {
    fill: "#f59e0b",
    stroke: "#fbbf24",
    badge: "amber" as const,
  };
}

export function SkillGraph() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 shadow-premium sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Demo current-state graph
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Skills become a map, not a list
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="green">Strong</Badge>
          <Badge variant="blue">Working</Badge>
          <Badge variant="amber">Gap</Badge>
        </div>
      </div>

      <div className="max-w-full overflow-hidden">
        <svg
          viewBox="0 0 820 360"
          role="img"
          aria-label="Demo skill graph showing current skills and gaps"
          className="h-[260px] w-full sm:h-[330px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="skillGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {edges.map(([fromId, toId]) => {
            const from = nodes.find((node) => node.id === fromId);
            const to = nodes.find((node) => node.id === toId);

            if (!from || !to) {
              return null;
            }

            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {nodes.map((node) => {
            const color = getNodeColor(node.level);

            return (
              <g
                key={node.id}
                className="origin-center transition-transform duration-300 hover:scale-105"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="24"
                  fill={color.fill}
                  fillOpacity="0.14"
                  stroke={color.stroke}
                  strokeWidth="2"
                  filter="url(#skillGlow)"
                />

                <circle cx={node.x} cy={node.y} r="6" fill={color.stroke} />

                <text
                  x={node.x}
                  y={node.y + 46}
                  textAnchor="middle"
                  className="fill-slate-300 text-[11px] font-medium sm:text-[13px]"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-800 pt-5 sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-500">Current role</p>
          <p className="mt-1 text-sm font-medium text-white">
            .NET Backend Developer
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Experience</p>
          <p className="mt-1 text-sm font-medium text-white">2 years</p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Target direction</p>
          <p className="mt-1 text-sm font-medium text-white">
            Java Backend Engineer
          </p>
        </div>
      </div>
    </div>
  );
}