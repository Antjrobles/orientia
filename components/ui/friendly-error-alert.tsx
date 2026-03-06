"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface FriendlyErrorAlertProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export function FriendlyErrorAlert({
  title = "No pudimos completar la acción",
  message,
  actionLabel = "Reintentar",
  onAction,
  onDismiss,
}: FriendlyErrorAlertProps) {
  return (
    <Alert className="border-rose-500/40 bg-rose-500/10 text-rose-100">
      <AlertCircle className="h-4 w-4 text-rose-300" />
      <AlertTitle className="text-rose-100">{title}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-sm text-rose-100/90">{message}</p>
        <div className="flex flex-wrap gap-2">
          {onAction && (
            <Button
              type="button"
              size="sm"
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
          {onDismiss && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-rose-300/40 bg-transparent text-rose-100 hover:bg-rose-500/15"
              onClick={onDismiss}
            >
              Cerrar
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
