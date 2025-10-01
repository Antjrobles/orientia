import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";

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
        <Label htmlFor={`${idPrefix}nombre`} className="flex items-center gap-2">
          Nombre y Apellidos
          <Shield className="w-4 h-4 text-emerald-600" />
        </Label>
        <Input
          id={`${idPrefix}nombre`}
          value={form.nombre || "Alumno/a [Código Anónimo]"}
          readOnly
          disabled
          className="bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300 font-mono text-sm"
          title="Campo protegido por LOPD - No se permiten nombres reales"
        />
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Campo anonimizado por protección de datos (LOPD)
        </p>
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
        <Select
          value={form.curso || undefined}
          onValueChange={(value) => handleChange("curso", value)}
        >
          <SelectTrigger
            id={`${idPrefix}curso`}
            className={errors?.curso ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Selecciona el curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Infantil 3 años">Infantil 3 años</SelectItem>
            <SelectItem value="Infantil 4 años">Infantil 4 años</SelectItem>
            <SelectItem value="Infantil 5 años">Infantil 5 años</SelectItem>
            <SelectItem value="1º Educación Primaria">1º Educación Primaria</SelectItem>
            <SelectItem value="2º Educación Primaria">2º Educación Primaria</SelectItem>
            <SelectItem value="3º Educación Primaria">3º Educación Primaria</SelectItem>
            <SelectItem value="4º Educación Primaria">4º Educación Primaria</SelectItem>
            <SelectItem value="5º Educación Primaria">5º Educación Primaria</SelectItem>
            <SelectItem value="6º Educación Primaria">6º Educación Primaria</SelectItem>
          </SelectContent>
        </Select>
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