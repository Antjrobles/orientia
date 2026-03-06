"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, HelpCircle, Lightbulb, Rocket } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type HelpAction = {
  label: string;
  href: string;
};

type HelpContext = {
  title: string;
  description: string;
  tips: string[];
  actions: HelpAction[];
};

const helpBySegment: Record<string, HelpContext> = {
  profile: {
    title: "Ayuda de perfil",
    description: "Sugerencias para trabajar más rápido en tus informes.",
    tips: [
      "Usa Ctrl/Cmd + S para guardar borrador.",
      "Puedes reordenar secciones arrastrando “Mover sección”.",
      "Ctrl/Cmd + Enter genera el informe con los datos actuales.",
    ],
    actions: [
      { label: "Generar informe", href: "/profile/generar-informe" },
      { label: "Ver informes", href: "/profile/informes" },
    ],
  },
  admin: {
    title: "Ayuda de administración",
    description: "Atajos prácticos para gestionar usuarios y comunicaciones.",
    tips: [
      "Filtra por rol y verificación para campañas precisas.",
      "Revisa la tabla de usuarios antes de envíos masivos.",
      "Usa “Buscar” tras ajustar filtros para refrescar resultados.",
    ],
    actions: [
      { label: "Panel admin", href: "/admin" },
      { label: "Comunicaciones", href: "/admin/comunicaciones" },
    ],
  },
  blog: {
    title: "Ayuda del blog",
    description: "Navega y consume contenido de forma más eficiente.",
    tips: [
      "Accede a artículos relacionados al final de cada post.",
      "Usa breadcrumbs para volver al listado sin perder contexto.",
    ],
    actions: [{ label: "Ir al blog", href: "/blog" }],
  },
};

const defaultContext: HelpContext = {
  title: "Ayuda contextual",
  description: "Consejos relevantes según la página actual.",
  tips: [
    "Explora la navegación rápida del breadcrumb.",
    "Si algo falla, revisa el mensaje de error y usa “Reintentar”.",
  ],
  actions: [{ label: "Inicio", href: "/" }],
};

export default function ContextualHelp() {
  const pathname = usePathname() ?? "";
  const rootSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const context = helpBySegment[rootSegment] ?? defaultContext;

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon"
            className="h-11 w-11 rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-300"
            aria-label="Abrir ayuda contextual"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[320px] p-3">
          <div className="space-y-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Compass className="h-4 w-4 text-emerald-600" />
                {context.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {context.description}
              </p>
            </div>

            <div className="space-y-2">
              {context.tips.map((tip) => (
                <div
                  key={tip}
                  className="flex items-start gap-2 rounded-md border border-border/70 bg-muted/35 px-2.5 py-2"
                >
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="text-xs text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {context.actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
                >
                  <span>{action.label}</span>
                  <Rocket className="h-3.5 w-3.5 text-emerald-600" />
                </Link>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
