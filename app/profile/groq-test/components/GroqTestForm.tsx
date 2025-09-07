'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StudentData } from '@/lib/groq/types';

interface GroqTestFormProps {
  onSubmit: (data: StudentData) => void;
  isLoading: boolean;
}

export function GroqTestForm({ onSubmit, isLoading }: GroqTestFormProps) {
  const [formData, setFormData] = useState<StudentData>({
    nombre: '',
    curso: '',
    motivoConsulta: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.curso.trim()) {
      newErrors.curso = 'El curso es requerido';
    }

    if (!formData.motivoConsulta.trim()) {
      newErrors.motivoConsulta = 'El motivo de consulta es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof StudentData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleClear = () => {
    setFormData({
      nombre: '',
      curso: '',
      motivoConsulta: '',
      observaciones: ''
    });
    setErrors({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Alumno</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Alumno *</Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: María García López"
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>

          {/* Campo Edad eliminado para alinear con el flujo actual */}

          <div className="space-y-2">
            <Label htmlFor="curso">Curso *</Label>
            <Input
              id="curso"
              type="text"
              value={formData.curso}
              onChange={(e) => handleInputChange('curso', e.target.value)}
              placeholder="Ej: 6º Primaria"
              className={errors.curso ? 'border-red-500' : ''}
            />
            {errors.curso && (
              <p className="text-sm text-red-500">{errors.curso}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivoConsulta">Motivo de Consulta *</Label>
            <Textarea
              id="motivoConsulta"
              value={formData.motivoConsulta}
              onChange={(e) => handleInputChange('motivoConsulta', e.target.value)}
              placeholder="Ej: Dificultades en el aprendizaje de las matemáticas"
              rows={3}
              className={errors.motivoConsulta ? 'border-red-500' : ''}
            />
            {errors.motivoConsulta && (
              <p className="text-sm text-red-500">{errors.motivoConsulta}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones Adicionales</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              placeholder="Información adicional relevante (opcional)"
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Generando...' : 'Generar Informe'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isLoading}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
