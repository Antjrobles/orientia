"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import TurnstileWidget from "@/components/security/TurnstileWidget";

// Definiciones de Tipos que coinciden EXACTAMENTE con tu JSON
interface Locality {
  name: string;
  schools: string[];
}
interface Municipality {
  name: string;
  localities: Locality[];
}
interface ProvinceData {
  province: string;
  municipalities: Municipality[];
}

const ContactForm: React.FC = () => {
  // Estados para gestionar el formulario y los datos de localización
  const [form, setForm] = useState({
    name: "",
    email: "",
    province: "",
    municipality: "",
    locality: "",
    school: "",
    message: "",
  });
  const [locations, setLocations] = useState<ProvinceData[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [schools, setSchools] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldLoadLocations, setShouldLoadLocations] = useState(false);
  const [dataStatus, setDataStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");

  const ensureLocationsLoaded = () => setShouldLoadLocations(true);

  useEffect(() => {
    if (shouldLoadLocations) return;
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoadLocations(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoadLocations(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoadLocations]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Lógica de carga del JSON. Esto ya funciona.
  useEffect(() => {
    if (!shouldLoadLocations) return;
    const fetchLocations = async () => {
      setDataStatus("loading");
      try {
        const response = await fetch("/andalucia_centros_completo.json");
        if (!response.ok)
          throw new Error(
            `El servidor respondió con un error: ${response.status}`,
          );
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json"))
          throw new TypeError(
            `Se esperaba un JSON, pero el servidor devolvió un fichero de tipo '${contentType}'.`,
          );
        const data: ProvinceData[] = await response.json();
        setLocations(data);
        setDataStatus("success");
      } catch (err: any) {
        console.error("ERROR CARGANDO DATOS DE LOCALIZACIÓN:", err);
        setErrorMessage(err.message);
        setDataStatus("error");
      }
    };
    fetchLocations();
  }, [shouldLoadLocations]);

  // Lógica de actualización de desplegables.
  useEffect(() => {
    const provinceData = locations.find((p) => p.province === form.province);
    setMunicipalities(provinceData ? provinceData.municipalities : []);
    setLocalities([]);
    setSchools([]);
    if (form.province)
      setForm((f) => ({ ...f, municipality: "", locality: "", school: "" }));
    clearValidation(["municipality", "locality", "school"]);
  }, [form.province, locations]);

  useEffect(() => {
    const municipalityData = municipalities.find(
      (m) => m.name === form.municipality,
    );
    setLocalities(municipalityData ? municipalityData.localities : []);
    setSchools([]);
    if (form.municipality) setForm((f) => ({ ...f, locality: "", school: "" }));
    clearValidation(["locality", "school"]);
  }, [form.municipality, municipalities]);

  useEffect(() => {
    const localityData = localities.find((l) => l.name === form.locality);
    setSchools(localityData ? localityData.schools : []);
    if (form.locality) setForm((f) => ({ ...f, school: "" }));
    clearValidation(["school"]);
  }, [form.locality, localities]);

  const validateField = (field: string, value: string) => {
    const trimmed = value.trim();
    if (field === "name") {
      if (!trimmed) return "El nombre es obligatorio.";
      if (trimmed.length < 2) return "El nombre es demasiado corto.";
    }
    if (field === "email") {
      if (!trimmed) return "El email es obligatorio.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "El email no es valido.";
      }
    }
    if (field === "province" && !value) return "Selecciona una provincia.";
    if (field === "municipality" && !value) return "Selecciona un municipio.";
    if (field === "locality" && !value) return "Selecciona una localidad.";
    if (field === "school" && !value) return "Selecciona un centro.";
    return "";
  };

  const setFieldError = (field: string, value: string) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const clearValidation = (fields: string[]) => {
    if (fields.length === 0) return;
    setErrors((prev) => {
      const next = { ...prev };
      fields.forEach((field) => delete next[field]);
      return next;
    });
    setTouched((prev) => {
      const next = { ...prev };
      fields.forEach((field) => delete next[field]);
      return next;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
    if (touched[id]) {
      setFieldError(id, value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    markTouched(id);
    setFieldError(id, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "email",
      "province",
      "municipality",
      "locality",
      "school",
    ];
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      const value = form[field as keyof typeof form] as string;
      const error = validateField(field, value || "");
      if (error) newErrors[field] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setTouched((prev) => ({
        ...prev,
        ...requiredFields.reduce<Record<string, boolean>>(
          (acc, field) => ({ ...acc, [field]: true }),
          {},
        ),
      }));
      setSubmitStatus("error");
      setErrorMessage("Revisa los campos marcados.");
      setTimeout(() => setSubmitStatus("idle"), 5000);
      return;
    }

    if (!turnstileToken) {
      setSubmitStatus("error");
      setErrorMessage("Por favor, completa la verificación de seguridad.");
      setTimeout(() => setSubmitStatus("idle"), 5000);
      return;
    }

    setSubmitStatus("loading");
    const submissionData = {
      ...form,
      school: `${form.school} (${form.locality}, ${form.municipality}, ${form.province})`,
      turnstileToken,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const result = await res.json();
      if (res.ok) {
        setSubmitStatus("success");
        setForm({
          name: "",
          email: "",
          province: "",
          municipality: "",
          locality: "",
          school: "",
          message: "",
        });
        setErrors({});
        setTouched({});
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } else {
        throw new Error(result.message || "El envío del formulario falló.");
      }
    } catch (err: any) {
      console.error("Error al enviar el formulario:", err);
      setSubmitStatus("error");
      // Auto-hide error message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const inputBaseClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 focus:border-green-500";
  const MESSAGE_MAX = 2000;
  const messageLength = (form.message || "").length;
  const remainingChars = Math.max(0, MESSAGE_MAX - messageLength);
  const getFieldClass = (field: string) => {
    if (errors[field]) {
      return `${inputBaseClass} border-red-500 focus:ring-red-500 focus:border-red-500`;
    }
    if (touched[field]) {
      return `${inputBaseClass} border-green-500 focus:ring-green-500 focus:border-green-500`;
    }
    return inputBaseClass;
  };

  const renderLocationSelectors = () => {
    if (dataStatus === "idle") {
      return (
        <div className="text-center p-4 text-gray-600">
          <button
            type="button"
            onClick={ensureLocationsLoaded}
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Cargar centros
          </button>
        </div>
      );
    }
    if (dataStatus === "loading") {
      return (
        <div className="text-center p-4 text-gray-500">
          Cargando localizaciones...
        </div>
      );
    }
    if (dataStatus === "error") {
      return (
        <div className="text-center p-4 font-bold text-red-500">
          ERROR: {errorMessage}
        </div>
      );
    }
    return (
      <div
        id="contacform"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      >
        <div>
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Provincia
          </label>
          <select
            id="province"
            value={form.province}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClass("province")}
            required
          >
            <option value="">Selecciona provincia...</option>
            {locations
              .sort((a, b) => a.province.localeCompare(b.province, "es"))
              .map((p) => (
                <option key={p.province} value={p.province}>
                  {p.province}
                </option>
              ))}
          </select>
          {touched.province && errors.province && (
            <p className="mt-1 text-xs text-red-600">{errors.province}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="municipality"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Municipio
          </label>
          <select
            id="municipality"
            value={form.municipality}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!form.province}
            className={`${getFieldClass("municipality")} disabled:opacity-50`}
            required
          >
            <option value="">Selecciona municipio...</option>
            {municipalities
              .sort((a, b) => a.name.localeCompare(b.name, "es"))
              .map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
          </select>
          {touched.municipality && errors.municipality && (
            <p className="mt-1 text-xs text-red-600">{errors.municipality}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="locality"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Localidad
          </label>
          <select
            id="locality"
            value={form.locality}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!form.municipality}
            className={`${getFieldClass("locality")} disabled:opacity-50`}
            required
          >
            <option value="">Selecciona localidad...</option>
            {localities
              .sort((a, b) => a.name.localeCompare(b.name, "es"))
              .map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name}
                </option>
              ))}
          </select>
          {touched.locality && errors.locality && (
            <p className="mt-1 text-xs text-red-600">{errors.locality}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="school"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Centro Educativo
          </label>
          <select
            id="school"
            value={form.school}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!form.locality}
            className={`${getFieldClass("school")} disabled:opacity-50`}
            required
          >
            <option value="">Selecciona un centro...</option>
            {schools
              .sort((a, b) => a.localeCompare(b, "es"))
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
          {touched.school && errors.school && (
            <p className="mt-1 text-xs text-red-600">{errors.school}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="contacto"
      onFocusCapture={ensureLocationsLoaded}
      onPointerEnter={ensureLocationsLoaded}
      className="py-10 bg-primary-300 text-white scroll-mt-16"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            {" "}
            {/* Increased margin */}
            <h2 className="text-3xl md:text-4xl text-black font-bold mb-4">
              Comienza a transformar tus clases hoy mismo
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              Únete a miles de profesores en Andalucía que ya están mejorando la
              experiencia educativa de sus alumnos
            </p>
          </div>
          {/* Subtle shadow and slightly less rounded corners for a modern feel */}
          <div className="bg-white rounded-lg  shadow-md overflow-hidden border-2 border-green-600">
            <div className="p-8 md:p-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 text-center">
                {" "}
                {/* Centered title */}
                Solicita información
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                {" "}
                {/* Centered subtitle */}
                Déjanos tus datos y te contactaremos para mostrarte cómo nuestra
                plataforma puede ayudarte.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldClass("name")}
                      placeholder="Tu nombre"
                      required
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldClass("email")}
                      placeholder="correo@ejemplo.com"
                      required
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                {renderLocationSelectors()}
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mensaje (opcional)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getFieldClass("message")}
                    placeholder="Cuéntanos lo que necesitas..."
                    maxLength={MESSAGE_MAX}
                  ></textarea>
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {remainingChars} caracteres restantes
                  </div>
                </div>

                {/* CAPTCHA de seguridad */}
                <TurnstileWidget
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                />

                {/* Slightly refined button padding and rounded corners */}
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-5 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-white"
                  disabled={submitStatus === "loading" || !turnstileToken}
                >
                  {submitStatus === "loading"
                    ? "Enviando..."
                    : "Solicitar información"}{" "}
                  <Send className="ml-2 w-5 h-5" />
                </button>
                {/* Success Message */}
                {submitStatus === "success" && (
                  <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md animate-in fade-in slide-in-from-bottom-2">
                    <p className="font-medium">¡Gracias por tu interés!</p>
                    <p className="text-sm">
                      Hemos recibido tu solicitud y te contactaremos pronto.
                      También te hemos enviado un email de confirmación.
                    </p>
                  </div>
                )}
                {/* Error Message */}
                {submitStatus === "error" && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p className="font-medium">Error al enviar el formulario</p>
                    <p className="text-sm">
                      {errorMessage || "Por favor, inténtalo de nuevo o contacta con nosotros directamente."}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-primary-100 mb-4">
              ¿Prefieres hablar directamente con nosotros?
            </p>
            <a
              href="tel:+34900123456"
              className="inline-flex items-center text-white font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 rounded"
            >
              Llámanos al 900 123 456 <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
