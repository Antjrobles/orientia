'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface InformeCompletoData {
  alumno: {
    nombre: string;
    fecha_nacimiento: string;
    nie: string;
    curso: string;
  };
  centro: {
    nombre: string;
    localidad: string;
  };
  tutores: string[];
  etapa_escolar: string;
  edad: number;
  motivo_consulta: string;
  observaciones: string;
}

interface InformeCompletoFormProps {
  onSubmit: (data: InformeCompletoData) => void;
  isLoading: boolean;
}

export function InformeCompletoForm({ onSubmit, isLoading }: InformeCompletoFormProps) {
  const [formData, setFormData] = useState<InformeCompletoData>({
    alumno: {
      nombre: '',
      fecha_nacimiento: '',
      nie: '',
      curso: '',
    },
    centro: {
      nombre: '',
      localidad: '',
    },
    tutores: [''],
    etapa_escolar: '',
    edad: 0,
    motivo_consulta: '',
    observaciones: '',
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.alumno.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.alumno.fecha_nacimiento) newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.alumno.curso.trim()) newErrors.curso = 'El curso es requerido';
    if (!formData.centro.nombre.trim()) newErrors.centro_nombre = 'El nombre del centro es requerido';
    if (!formData.centro.localidad.trim()) newErrors.centro_localidad = 'La localidad es requerida';
    if (!formData.etapa_escolar.trim()) newErrors.etapa_escolar = 'La etapa escolar es requerida';
    if (!formData.edad || formData.edad < 3 || formData.edad > 25) newErrors.edad = 'La edad debe estar entre 3 y 25 años';
    if (!formData.motivo_consulta.trim()) newErrors.motivo_consulta = 'El motivo de consulta es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    const keys = field.split('.');

    // Protección contra prototype pollution
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    if (keys.some(k => dangerousKeys.includes(k))) {
      console.warn('Intento de prototype pollution bloqueado:', keys);
      return;
    }

    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });

    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleTutorChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tutores: prev.tutores.map((tutor, i) => i === index ? value : tutor)
    }));
  };

  const addTutor = () => {
    setFormData(prev => ({
      ...prev,
      tutores: [...prev.tutores, '']
    }));
  };

  const removeTutor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tutores: prev.tutores.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos Completos del Informe</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos del Alumno */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Datos del Alumno</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  value={formData.alumno.nombre}
                  onChange={(e) => handleInputChange('alumno.nombre', e.target.value)}
                  placeholder="Ej: María García López"
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.alumno.fecha_nacimiento}
                  onChange={(e) => handleInputChange('alumno.fecha_nacimiento', e.target.value)}
                  className={errors.fecha_nacimiento ? 'border-red-500' : ''}
                />
                {errors.fecha_nacimiento && <p className="text-sm text-red-500">{errors.fecha_nacimiento}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nie">NIE</Label>
                <Input
                  id="nie"
                  value={formData.alumno.nie}
                  onChange={(e) => handleInputChange('alumno.nie', e.target.value)}
                  placeholder="Ej: 12345678A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edad">Edad *</Label>
                <Input
                  id="edad"
                  type="number"
                  min="3"
                  max="25"
                  value={formData.edad || ''}
                  onChange={(e) => handleInputChange('edad', parseInt(e.target.value) || 0)}
                  className={errors.edad ? 'border-red-500' : ''}
                />
                {errors.edad && <p className="text-sm text-red-500">{errors.edad}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="curso">Curso *</Label>
                <Input
                  id="curso"
                  value={formData.alumno.curso}
                  onChange={(e) => handleInputChange('alumno.curso', e.target.value)}
                  placeholder="Ej: 6º Primaria"
                  className={errors.curso ? 'border-red-500' : ''}
                />
                {errors.curso && <p className="text-sm text-red-500">{errors.curso}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="etapa_escolar">Etapa Escolar *</Label>
                <Input
                  id="etapa_escolar"
                  value={formData.etapa_escolar}
                  onChange={(e) => handleInputChange('etapa_escolar', e.target.value)}
                  placeholder="Ej: Educación Primaria"
                  className={errors.etapa_escolar ? 'border-red-500' : ''}
                />
                {errors.etapa_escolar && <p className="text-sm text-red-500">{errors.etapa_escolar}</p>}
              </div>
            </div>
          </div>

          {/* Datos del Centro */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Datos del Centro</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="centro_nombre">Nombre del Centro *</Label>
                <Input
                  id="centro_nombre"
                  value={formData.centro.nombre}
                  onChange={(e) => handleInputChange('centro.nombre', e.target.value)}
                  placeholder="Ej: CEIP San José"
                  className={errors.centro_nombre ? 'border-red-500' : ''}
                />
                {errors.centro_nombre && <p className="text-sm text-red-500">{errors.centro_nombre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="centro_localidad">Localidad *</Label>
                <Input
                  id="centro_localidad"
                  value={formData.centro.localidad}
                  onChange={(e) => handleInputChange('centro.localidad', e.target.value)}
                  placeholder="Ej: Madrid"
                  className={errors.centro_localidad ? 'border-red-500' : ''}
                />
                {errors.centro_localidad && <p className="text-sm text-red-500">{errors.centro_localidad}</p>}
              </div>
            </div>
          </div>

          {/* Tutores */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Tutores</h3>
              <Button type="button" variant="outline" size="sm" onClick={addTutor}>
                Añadir Tutor
              </Button>
            </div>

            {formData.tutores.map((tutor, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={tutor}
                  onChange={(e) => handleTutorChange(index, e.target.value)}
                  placeholder={`Tutor ${index + 1}`}
                  className="flex-1"
                />
                {formData.tutores.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTutor(index)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Motivo y Observaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Evaluación</h3>

            <div className="space-y-2">
              <Label htmlFor="motivo_consulta">Motivo de Consulta *</Label>
              <Textarea
                id="motivo_consulta"
                value={formData.motivo_consulta}
                onChange={(e) => handleInputChange('motivo_consulta', e.target.value)}
                placeholder="Describe el motivo por el cual se solicita la evaluación"
                rows={3}
                className={errors.motivo_consulta ? 'border-red-500' : ''}
              />
              {errors.motivo_consulta && <p className="text-sm text-red-500">{errors.motivo_consulta}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones Adicionales</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Información adicional relevante"
                rows={2}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Generando Informe...' : 'Generar Informe Completo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
