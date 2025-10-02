"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Muestra el botón cuando el usuario ha hecho scroll hacia abajo
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Añade un listener al evento de scroll cuando el componente se monta
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Función para hacer scroll suave hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Clases base del botón
  const buttonBaseClasses =
    "fixed bottom-6 right-6 z-50 p-3 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-in-out";

  // Clases de visibilidad
  const visibilityClasses = isVisible
    ? "opacity-100 scale-100"
    : "opacity-0 scale-0";

  return (
    <button
      className={`${buttonBaseClasses} ${visibilityClasses}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
    >
      <ArrowUp className={`h-6 w-6`} />
    </button>
  );
};

export default BackToTopButton;
