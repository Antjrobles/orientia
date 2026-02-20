"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BajaComunicacionesPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Procesando solicitud...");

  useEffect(() => {
    const submit = async () => {
      if (!token) {
        setStatus("error");
        setMessage("El enlace de baja no es válido.");
        return;
      }

      try {
        const response = await fetch("/api/communications/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "No se pudo gestionar la baja.");
        }

        setStatus("success");
        setMessage("La baja de comunicaciones se ha registrado correctamente.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "No se pudo gestionar la baja.",
        );
      }
    };

    void submit();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50">
      <div className="w-full px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <Card className="w-full border-emerald-100/70 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Gestión de comunicaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "loading" && (
              <p className="text-sm text-gray-600">{message}</p>
            )}
            {status === "success" && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Solicitud completada
                </div>
                <p>{message}</p>
              </div>
            )}
            {status === "error" && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  No se pudo completar la baja
                </div>
                <p>{message}</p>
              </div>
            )}

            <div className="pt-2">
              <Button asChild variant="outline">
                <Link href="/">Volver a Orientia</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
