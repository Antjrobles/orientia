import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormSectionProps {
  value: string;
  title: string;
  icon: React.ReactNode;
  isComplete: boolean;
  className?: string;
  children: React.ReactNode;
  onSave: () => void;
}

export function FormSection({
  value,
  title,
  icon,
  isComplete,
  className = "rounded-md section-odd mb-2 border-l-4 section-odd-border",
  children,
  onSave,
}: FormSectionProps) {
  return (
    <AccordionItem value={value} className={className}>
      <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
        {icon}
        <span>{title}</span>
        <Badge
          className="ml-auto"
          variant={isComplete ? "default" : "secondary"}
        >
          {isComplete ? "Completo" : "Pendiente"}
        </Badge>
      </AccordionTrigger>
      <AccordionContent className="px-4">
        {children}
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onSave}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
