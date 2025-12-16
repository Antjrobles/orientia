"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

// Tiempo de inactividad en milisegundos (30 minutos = 1800000 ms)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

/**
 * Componente de seguridad: cierra sesión automáticamente tras inactividad.
 *
 * Detecta actividad del usuario (movimiento del ratón, teclas, clics, scroll).
 * Si no hay actividad durante el tiempo configurado, hace logout automático.
 *
 * Configuración por defecto: 30 minutos de inactividad
 */
export default function AutoLogout() {
  const { status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Solo ejecutar si hay una sesión activa
    if (status !== "authenticated") {
      return;
    }

    // Función que se ejecuta cuando hay inactividad
    const handleInactivity = async () => {
      await signOut({ callbackUrl: "/login" });
    };

    // Resetea el temporizador de inactividad
    const resetTimer = () => {
      // Limpiar el temporizador anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Crear nuevo temporizador
      timeoutRef.current = setTimeout(handleInactivity, INACTIVITY_TIMEOUT);
    };

    // Eventos que indican actividad del usuario
    const events = [
      "mousedown",    // Clic del ratón
      "mousemove",    // Movimiento del ratón
      "keypress",     // Tecla presionada
      "scroll",       // Scroll en la página
      "touchstart",   // Toque en pantalla táctil
      "click",        // Clic
    ];

    // Añadir listeners a todos los eventos
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    // Iniciar el temporizador cuando se monta el componente
    resetTimer();

    // Cleanup: limpiar temporizador y eventos al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [status]);

  // Este componente no renderiza nada, solo ejecuta lógica
  return null;
}
