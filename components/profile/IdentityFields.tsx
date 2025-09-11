import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IdentityFieldsProps {
  idPrefix?: string;
  nombre: string;
  fechaNacimiento?: string;
  curso: string;
  unidad?: string;
  onNombreChange: (value: string) => void;
  onFechaNacimientoChange: (value: string) => void;
  onCursoChange: (value: string) => void;
  onUnidadChange: (value: string) => void;
  errors?: {
    nombre?: string;
    curso?: string;
  };
}

export function IdentityFields({ 
  idPrefix = "", 
  nombre,
  fechaNacimiento,
  curso,
  unidad,
  onNombreChange,
  onFechaNacimientoChange,
  onCursoChange,
  onUnidadChange,
  errors
}: IdentityFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}nombre`}>Nombre</Label>
        <Input
          id={`${idPrefix}nombre`}
          value={nombre}
          onChange={(e) => onNombreChange(e.target.value)}
          className={errors?.nombre ? "border-red-500" : ""}
          placeholder="Ej: Lidia Montoya Barea"
        />
        {errors?.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}fechaNacimiento`}>Fecha de nacimiento</Label>
        <Input
          id={`${idPrefix}fechaNacimiento`}
          type="date"
          value={fechaNacimiento || ""}
          onChange={(e) => onFechaNacimientoChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}curso`}>Curso</Label>
        <Input
          id={`${idPrefix}curso`}
          value={curso}
          onChange={(e) => onCursoChange(e.target.value)}
          className={errors?.curso ? "border-red-500" : ""}
          placeholder="Ej: 6º de Educ. Primaria (Matriculado)"
        />
        {errors?.curso && <p className="text-sm text-red-500">{errors.curso}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}unidad`}>Unidad</Label>
        <Input
          id={`${idPrefix}unidad`}
          value={unidad || ""}
          onChange={(e) => onUnidadChange(e.target.value)}
          placeholder="Ej: 6ºA"
        />
      </div>
    </div>
  );
}