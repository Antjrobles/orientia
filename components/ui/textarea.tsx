import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border-2 border-slate-200 bg-background px-3 py-2 text-base transition-shadow transition-colors placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-0 focus:shadow-[0_0_0_1px_rgba(16,185,129,0.4)] focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_rgba(16,185,129,0.4)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
