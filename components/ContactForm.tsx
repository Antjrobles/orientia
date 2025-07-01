'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Send } from 'lucide-react';

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
    name: '',
    email: '',
    province: '',
    municipality: '',
    locality: '',
    school: '',
    message: '',
  });
  const [locations, setLocations] = useState<ProvinceData[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [schools, setSchools] = useState<string[]>([]);

  const [dataStatus, setDataStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Lógica de carga del JSON. Esto ya funciona.
  useEffect(() => {
    const fetchLocations = async () => {
      setDataStatus('loading');
      try {
        const response = await fetch('/andalucia_centros_completo.json');
        if (!response.ok) throw new Error(`El servidor respondió con un error: ${response.status}`);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json'))
          throw new TypeError(`Se esperaba un JSON, pero el servidor devolvió un fichero de tipo '${contentType}'.`);
        const data: ProvinceData[] = await response.json();
        setLocations(data);
        setDataStatus('success');
      } catch (err: any) {
        console.error('ERROR CARGANDO DATOS DE LOCALIZACIÓN:', err);
        setErrorMessage(err.message);
        setDataStatus('error');
      }
    };
    fetchLocations();
  }, []);

  // Lógica de actualización de desplegables.
  useEffect(() => {
    const provinceData = locations.find((p) => p.province === form.province);
    setMunicipalities(provinceData ? provinceData.municipalities : []);
    setLocalities([]);
    setSchools([]);
    if (form.province) setForm((f) => ({ ...f, municipality: '', locality: '', school: '' }));
  }, [form.province, locations]);

  useEffect(() => {
    const municipalityData = municipalities.find((m) => m.name === form.municipality);
    setLocalities(municipalityData ? municipalityData.localities : []);
    setSchools([]);
    if (form.municipality) setForm((f) => ({ ...f, locality: '', school: '' }));
  }, [form.municipality, municipalities]);

  useEffect(() => {
    const localityData = localities.find((l) => l.name === form.locality);
    setSchools(localityData ? localityData.schools : []);
    if (form.locality) setForm((f) => ({ ...f, school: '' }));
  }, [form.locality, localities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    const submissionData = {
      ...form,
      school: `${form.school} (${form.locality}, ${form.municipality}, ${form.province})`,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
        setForm({ name: '', email: '', province: '', municipality: '', locality: '', school: '', message: '' });
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error(result.message || 'El envío del formulario falló.');
      }
    } catch (err: any) {
      console.error('Error al enviar el formulario:', err);
      setSubmitStatus('error');
      // Auto-hide error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const renderLocationSelectors = () => {
    if (dataStatus === 'loading') {
      return <div className='text-center p-4 text-gray-500 dark:text-gray-400'>Cargando localizaciones...</div>;
    }
    if (dataStatus === 'error') {
      return <div className='text-center p-4 font-bold text-red-500'>ERROR: {errorMessage}</div>;
    }
    return (
      <div id='contacform' className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <div>
          <label htmlFor='province' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Provincia
          </label>
          <select
            id='province'
            value={form.province}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            required>
            <option value=''>Selecciona provincia...</option>
            {locations
              .sort((a, b) => a.province.localeCompare(b.province, 'es'))
              .map((p) => (
                <option key={p.province} value={p.province}>
                  {p.province}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor='municipality' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Municipio
          </label>
          <select
            id='municipality'
            value={form.municipality}
            onChange={handleChange}
            disabled={!form.province}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50'
            required>
            <option value=''>Selecciona municipio...</option>
            {municipalities
              .sort((a, b) => a.name.localeCompare(b.name, 'es'))
              .map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor='locality' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Localidad
          </label>
          <select
            id='locality'
            value={form.locality}
            onChange={handleChange}
            disabled={!form.municipality}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50'
            required>
            <option value=''>Selecciona localidad...</option>
            {localities
              .sort((a, b) => a.name.localeCompare(b.name, 'es'))
              .map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor='school' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Centro Educativo
          </label>
          <select
            id='school'
            value={form.school}
            onChange={handleChange}
            disabled={!form.locality}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50'
            required>
            <option value=''>Selecciona un centro...</option>
            {schools
              .sort((a, b) => a.localeCompare(b, 'es'))
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <section id='ContactForm' className='py-16 md:py-24 bg-primary-600 text-white'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>Comienza a transformar tus clases hoy mismo</h2>
            <p className='text-xl text-primary-100 mb-8'>
              Únete a miles de profesores en Andalucía que ya están mejorando la experiencia educativa de sus alumnos
            </p>
          </div>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
            <div className='p-8 md:p-10'>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Solicita información</h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6'>
                Déjanos tus datos y te contactaremos para mostrarte cómo nuestra plataforma puede ayudarte.
              </p>
              <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Nombre completo
                    </label>
                    <input
                      type='text'
                      id='name'
                      value={form.name}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      placeholder='Tu nombre'
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Email
                    </label>
                    <input
                      type='email'
                      id='email'
                      value={form.email}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      placeholder='correo@ejemplo.com'
                      required
                    />
                  </div>
                </div>
                {renderLocationSelectors()}
                <div className='mb-6'>
                  <label htmlFor='message' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Mensaje (opcional)
                  </label>
                  <textarea
                    id='message'
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    placeholder='Cuéntanos lo que necesitas...'></textarea>
                </div>
                <button
                  type='submit'
                  className='w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={submitStatus === 'loading'}>
                  {submitStatus === 'loading' ? 'Enviando...' : 'Solicitar información'}{' '}
                  <Send className='ml-2 w-5 h-5' />
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className='mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg'>
                    <p className='font-medium'>¡Gracias por tu interés!</p>
                    <p className='text-sm'>
                      Hemos recibido tu solicitud y te contactaremos pronto. También te hemos enviado un email de
                      confirmación.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
                    <p className='font-medium'>Error al enviar el formulario</p>
                    <p className='text-sm'>Por favor, inténtalo de nuevo o contacta con nosotros directamente.</p>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className='mt-12 text-center'>
            <p className='text-primary-100 mb-4'>¿Prefieres hablar directamente con nosotros?</p>
            <a href='tel:+34900123456' className='inline-flex items-center text-white font-medium hover:underline'>
              Llámanos al 900 123 456 <ArrowRight className='ml-1 w-4 h-4' />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
