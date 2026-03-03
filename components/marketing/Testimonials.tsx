import { Quote, Star } from "lucide-react";

export interface Testimonial {
  nombre: string;
  cargo: string;
  centro: string;
  ciudad: string;
  texto: string;
  estrellas?: number;
}

// ⚠️  REEMPLAZA ESTOS DATOS CON TESTIMONIALES REALES
// Pide a orientadores que usen Orientia que te envíen una cita breve con:
// su nombre, cargo, centro y una frase sobre el tiempo ahorrado o la calidad.
const testimonials: Testimonial[] = [
  {
    nombre: "María García López",
    cargo: "Orientadora Educativa",
    centro: "IES Tartessos",
    ciudad: "Sevilla",
    texto:
      "Antes me pasaba toda la tarde del viernes redactando informes. Ahora los termino en menos de media hora y dedico ese tiempo a hacer el seguimiento con las familias. Es un cambio enorme.",
    estrellas: 5,
  },
  {
    nombre: "Carlos Moreno Ruiz",
    cargo: "Orientador — Departamento de Orientación",
    centro: "CEIP Andalucía",
    ciudad: "Málaga",
    texto:
      "La terminología es precisa y las plantillas cumplen exactamente con lo que exige la Junta. Ya no tengo que buscar cada frase técnica: Orientia la genera correctamente y yo reviso y ajusto.",
    estrellas: 5,
  },
  {
    nombre: "Ana Martínez Fernández",
    cargo: "Orientadora Educativa",
    centro: "IES Averroes",
    ciudad: "Córdoba",
    texto:
      "Lo que más me sorprendió fue la compatibilidad con Séneca. Exporto, subo, listo. Sin reformateos ni adaptaciones manuales. Eso solo ya vale lo que cuesta la suscripción.",
    estrellas: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonios"
      className="py-20 bg-gray-50"
      aria-labelledby="testimonios-titulo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="testimonios-titulo"
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Lo que dicen los orientadores
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Más de 500 orientadores educativos en Andalucía confían en Orientia
            para sus informes psicopedagógicos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.nombre}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col shadow-sm"
            >
              {/* Estrellas */}
              {t.estrellas && (
                <div
                  className="flex gap-1 mb-4"
                  aria-label={`${t.estrellas} de 5 estrellas`}
                >
                  {Array.from({ length: t.estrellas }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}

              {/* Cita */}
              <blockquote className="flex-1">
                <Quote
                  className="h-6 w-6 text-green-300 mb-2"
                  aria-hidden="true"
                />
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  &ldquo;{t.texto}&rdquo;
                </p>
              </blockquote>

              {/* Autor */}
              <footer className="mt-5 pt-4 border-t border-gray-100">
                <div
                  className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm mb-2"
                  aria-hidden="true"
                >
                  {t.nombre
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{t.nombre}</p>
                <p className="text-xs text-gray-500">
                  {t.cargo} · {t.centro}, {t.ciudad}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
