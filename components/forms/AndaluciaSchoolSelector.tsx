"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type Props = {
  onSelectSchool: (selection: {
    schoolName: string;
    locality: string;
    municipality: string;
    province: string;
  }) => void;
};

export default function AndaluciaSchoolSelector({ onSelectSchool }: Props) {
  const [locations, setLocations] = useState<ProvinceData[]>([]);
  const [province, setProvince] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [locality, setLocality] = useState("");
  const [school, setSchool] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/andalucia_centros_completo.json");
        if (!response.ok) {
          throw new Error("No se pudo cargar el catalogo de centros.");
        }
        const data: ProvinceData[] = await response.json();
        setLocations(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar el catalogo de centros.",
        );
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const provinces = useMemo(
    () => [...locations].sort((a, b) => a.province.localeCompare(b.province, "es")),
    [locations],
  );

  const municipalities = useMemo(() => {
    const current = locations.find((item) => item.province === province);
    return [...(current?.municipalities || [])].sort((a, b) =>
      a.name.localeCompare(b.name, "es"),
    );
  }, [locations, province]);

  const localities = useMemo(() => {
    const current = municipalities.find((item) => item.name === municipality);
    return [...(current?.localities || [])].sort((a, b) =>
      a.name.localeCompare(b.name, "es"),
    );
  }, [municipalities, municipality]);

  const schools = useMemo(() => {
    const current = localities.find((item) => item.name === locality);
    return [...(current?.schools || [])].sort((a, b) => a.localeCompare(b, "es"));
  }, [localities, locality]);

  useEffect(() => {
    setMunicipality("");
    setLocality("");
    setSchool("");
  }, [province]);

  useEffect(() => {
    setLocality("");
    setSchool("");
  }, [municipality]);

  useEffect(() => {
    setSchool("");
  }, [locality]);

  const canApply = Boolean(school);

  return (
    <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-300">
        <MapPinned className="h-4 w-4" />
        Completar centro desde catalogo de Andalucia
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          Cargando centros...
        </div>
      ) : error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          <Select value={province || "none"} onValueChange={(value) => setProvince(value === "none" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Provincia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Provincia</SelectItem>
              {provinces.map((item) => (
                <SelectItem key={item.province} value={item.province}>
                  {item.province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={municipality || "none"}
            onValueChange={(value) => setMunicipality(value === "none" ? "" : value)}
            disabled={!province}
          >
            <SelectTrigger>
              <SelectValue placeholder="Municipio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Municipio</SelectItem>
              {municipalities.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={locality || "none"}
            onValueChange={(value) => setLocality(value === "none" ? "" : value)}
            disabled={!municipality}
          >
            <SelectTrigger>
              <SelectValue placeholder="Localidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Localidad</SelectItem>
              {localities.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={school || "none"}
            onValueChange={(value) => setSchool(value === "none" ? "" : value)}
            disabled={!locality}
          >
            <SelectTrigger>
              <SelectValue placeholder="Centro educativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Centro educativo</SelectItem>
              {schools.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              className="w-full border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200"
              onClick={() =>
                onSelectSchool({
                  schoolName: school,
                  locality,
                  municipality,
                  province,
                })
              }
              disabled={!canApply}
            >
              Usar este centro
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
