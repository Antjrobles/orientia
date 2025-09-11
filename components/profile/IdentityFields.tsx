import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IdentityFieldsProps {
  idPrefix?: string;
  form: any;
  handleChange: (field: any, value: any) => void;
  errors?: {
    nombre?: string;
    curso?: string;
  };
}

export function IdentityFields({ 
  idPrefix = "", 
  form,
  handleChange,
  errors
}: IdentityFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}nombre`}>Nombre</Label>
        <Input
          id={`${idPrefix}nombre`}
          value={form.nombre || ""}
          onChange={(e) => handleChange("nombre", e.target.value)}
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
          value={form.fechaNacimiento || ""}
          onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}curso`}>Curso</Label>
        <Input
          id={`${idPrefix}curso`}
          value={form.curso || ""}
          onChange={(e) => handleChange("curso", e.target.value)}
          className={errors?.curso ? "border-red-500" : ""}
          placeholder="Ej: 6º de Educ. Primaria (Matriculado)"
        />
        {errors?.curso && <p className="text-sm text-red-500">{errors.curso}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}unidad`}>Unidad</Label>
        <Input
          id={`${idPrefix}unidad`}
          value={form.unidad || ""}
          onChange={(e) => handleChange("unidad", e.target.value)}
          placeholder="Ej: 6ºA"
        />
      </div>
    </div>
  );
}