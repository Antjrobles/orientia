import type { ReactNode } from "react";

interface ResourcePageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ResourcePageShell({
  title,
  description,
  children,
}: ResourcePageShellProps) {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="rounded-xl border border-border bg-card p-8 shadow-xl sm:p-10">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-foreground sm:text-left">
          {title}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">{description}</p>
        <div className="prose prose-lg max-w-none">{children}</div>
      </div>
    </div>
  );
}
