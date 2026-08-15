import type { ReactNode } from "react";
import { Card } from "../ui/card";

type StatCardProps = {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  trend?: string;
};

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {value}
          </h3>

          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>

        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-brand-400">
            {icon}
          </div>
        ) : null}
      </div>

      {trend ? (
        <p className="mt-4 text-xs font-medium text-emerald-400">{trend}</p>
      ) : null}
    </Card>
  );
}