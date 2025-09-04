import * as React from "react"

export const DEFAULT_MOBILE_BREAKPOINT = 768

/**
 * useIsMobile
 * Devuelve true si el viewport actual es menor que el breakpoint indicado.
 * - Seguro en SSR (inicializa a false hasta hidratar)
 * - Usa matchMedia y escucha cambios de media query
 * - Acepta fallback para navegadores antiguos (addListener/removeListener)
 */
export function useIsMobile(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
      // SSR o entorno sin matchMedia
      setIsMobile(false)
      return
    }

    const query = `(max-width: ${breakpoint - 1}px)`
    const mql = window.matchMedia(query)

    const onChange = () => {
      setIsMobile(mql.matches)
    }

    // Suscripción con fallback para navegadores antiguos
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange)
    } else if (typeof (mql as any).addListener === "function") {
      ;(mql as any).addListener(onChange)
    }

    // Estado inicial
    setIsMobile(mql.matches)

    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", onChange)
      } else if (typeof (mql as any).removeListener === "function") {
        ;(mql as any).removeListener(onChange)
      }
    }
  }, [breakpoint])

  return !!isMobile
}
