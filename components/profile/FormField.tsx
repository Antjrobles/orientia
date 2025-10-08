import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  htmlFor?: string;
}

export function FormField({ label, children, htmlFor }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-slate-600">
        {label}
      </Label>
      {children}
    </div>
  );
}
