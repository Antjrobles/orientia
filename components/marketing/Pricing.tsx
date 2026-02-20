"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const pricingPlans = [
  {
    name: "Orientador Individual",
    price: { monthly: "Gratis" },
    period: { monthly: "Acceso Beta" },
    description:
      "Perfecto para orientadores de la Junta de Andalucía que quieren empezar a optimizar su trabajo.",
    features: [
      "Generación de hasta 5 informes al mes",
      "Acceso a plantillas oficiales básicas",
      "Gestión de informes centralizada",
      "Soporte por email",
    ],
    cta: "Solicitar Acceso",
    href: "/register",
    isFeatured: false,
  },
  {
    name: "Profesional",
    price: { monthly: "4.99€", yearly: "49.90€" },
    period: { monthly: "/mes", yearly: "/año" },
    description:
      "La solución ideal para profesionales y pequeños gabinetes que necesitan máxima eficiencia.",
    features: [
      "Generación de informes ilimitada",
      "Todas las plantillas oficiales y personalizables",
      "Exportación a PDF y Word",
      "Análisis de datos y estadísticas",
      "Soporte prioritario por chat",
    ],
    cta: "Comenzar Ahora",
    href: "/register?plan=profesional",
    isFeatured: true,
  },
  {
    name: "Centros Educativos",
    price: { monthly: "Contactar" },
    period: { monthly: "" },
    description:
      "Una solución a medida para equipos de orientación y centros educativos completos.",
    features: [
      "Todo lo del plan Profesional",
      "Gestión de múltiples usuarios y roles",
      "Panel de administración del centro",
      "Integraciones personalizadas (Séneca, etc.)",
      "Formación y onboarding para el equipo",
    ],
    cta: "Contactar con Ventas",
    href: "/#contacto",
    isFeatured: false,
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <section
      id="pricing"
      className="bg-background py-20 lg:py-24"
      aria-labelledby="pricing-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h2
            id="pricing-title"
            className="mb-4 text-3xl font-bold text-foreground lg:text-4xl"
          >
            Planes de Precios Flexibles
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Elige el plan que mejor se adapte a tus necesidades. Comienza gratis
            y escala cuando lo necesites.
          </p>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                billingCycle === "monthly"
                  ? "bg-green-600 text-white shadow"
                  : "border border-border bg-card text-foreground hover:bg-accent",
              )}
              aria-pressed={billingCycle === "monthly"}
            >
              Facturación Mensual
            </button>
            <div className="relative">
              <button
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                billingCycle === "yearly"
                  ? "bg-green-600 text-white shadow"
                  : "border border-border bg-card text-foreground hover:bg-accent",
              )}
                aria-pressed={billingCycle === "yearly"}
              >
                Facturación Anual
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
          {pricingPlans.map((plan) => {
            const price = plan.price[billingCycle] ?? plan.price.monthly;
            const period = plan.period[billingCycle] ?? plan.period.monthly;
            const href =
              plan.href.startsWith("/") && !plan.href.includes("#")
                ? `${plan.href}${plan.href.includes("?") ? "&" : "?"}billing=${billingCycle}`
                : plan.href;

            return (
              <div
                key={plan.name}
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border bg-card p-8 transition-all duration-300",
                  plan.isFeatured
                    ? "border-green-600 border-2 transform lg:scale-105 shadow-xl shadow-green-600/20 ring-2 ring-green-600/10"
                    : "border-border shadow-lg",
                )}
              >
                {plan.isFeatured && (
                  <Badge className="absolute top-0 -translate-y-1/2 bg-green-600 text-white px-4 py-1">
                    Más Popular
                  </Badge>
                )}

                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-2 min-h-[6rem] text-muted-foreground">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-end min-h-[4.5rem]">
                    <div>
                      <span className="text-4xl font-bold text-foreground">
                        {price}
                      </span>
                      {period && (
                        <span className="ml-1 text-lg font-medium text-muted-foreground">
                          {period}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckCircle
                          className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link href={href} className="w-full">
                    <Button
                      size="lg"
                      className="w-full font-semibold"
                      variant={plan.isFeatured ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
