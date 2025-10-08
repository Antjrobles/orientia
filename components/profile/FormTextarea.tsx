import { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        className={cn(
          "w-full border border-slate-300 bg-white shadow-sm focus-visible:border-violet-500 focus-visible:ring-violet-200",
          className,
        )}
        {...props}
      />
    );
  },
);

FormTextarea.displayName = "FormTextarea";
