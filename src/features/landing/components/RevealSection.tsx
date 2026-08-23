import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
};

export function RevealSection({ children, className = "" }: RevealSectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}