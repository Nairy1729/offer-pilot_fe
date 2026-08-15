import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        blue: "border-blue-500/25 bg-blue-500/10 text-blue-300",
        green: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        amber: "border-amber-500/25 bg-amber-500/10 text-amber-300",
        red: "border-red-500/25 bg-red-500/10 text-red-300",
        violet: "border-violet-500/25 bg-violet-500/10 text-violet-300",
        slate: "border-slate-600 bg-slate-800 text-slate-300",
      },
    },
    defaultVariants: {
      variant: "slate",
    },
  }
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}