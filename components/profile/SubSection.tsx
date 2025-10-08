import { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";

interface SubSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SubSection({
  title,
  children,
  className = "",
}: SubSectionProps) {
  return (
    <div
      className={`bg-white p-4 rounded-lg border-2 border-slate-300 ${className}`}
    >
      <SectionHeader title={title} />
      <div className="space-y-3">{children}</div>
    </div>
  );
}
