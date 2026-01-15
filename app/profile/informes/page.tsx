"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Spinner from "@/components/ui/Spinner";
import { useSession } from "next-auth/react";
import {
  Search,
  FileText,
  Eye,
  Edit,
  Copy,
  Trash2,
  Plus,
  CheckCircle2,
  Clock3,
  LayoutGrid,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface Informe {
  id: string;
  estado: "completado" | "borrador" | string;
  creado_en: string;
  actualizado_en: string;
  datos_identificativos?: {
    alumno?: {
      nombre?: string;
      curso?: string;
      fecha_nacimiento?: string;
    };
    centro?: {
      nombre?: string;
      localidad?: string;
    };
  };
  evaluacion_psicopedagogica?: {
    motivo_consulta?: string;
    informe_ia_generado?: string;
    observaciones?: string;
  };
}

interface InformeResumen {
  total: number;
  completados: number;
  borradores: number;
  otros: number;
}

function InformesContent() {
  const { data: session } = useSession();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [orden, setOrden] = useState("recientes");
  const [vista, setVista] = useState<"cards" | "list">("cards");
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [resumen, setResumen] = useState<InformeResumen>({
    total: 0,
    completados: 0,
    borradores: 0,
    otros: 0,
  });

  const fetchInformes = useCallback(async () => {
    if (!session) return;
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      estado: filtroEstado,
      orden,
    });
    if (busqueda.trim().length > 0) {
      params.set("search", busqueda.trim());
    }

    try {
      const response = await fetch(`/api/informes/list?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setInformes(data.informes || []);
        setTotal(data.total || 0);
        setResumen(data.resumen || resumen);
      }
    } catch (error) {
      console.error("Error al cargar informes:", error);
      setInformes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [session, page, pageSize, filtroEstado, orden, busqueda]);

  useEffect(() => {
    fetchInformes();
  }, [fetchInformes]);

  useEffect(() => {
    setPage(1);
  }, [busqueda, filtroEstado, orden, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "completado":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            Completado
          </Badge>
        );
      case "borrador":
        return <Badge variant="secondary">Borrador</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calcularProgreso = (informe: Informe) => {
    const checks = [
      informe.datos_identificativos?.alumno?.nombre,
      informe.datos_identificativos?.alumno?.curso,
      informe.datos_identificativos?.centro?.nombre,
      informe.datos_identificativos?.centro?.localidad,
      informe.evaluacion_psicopedagogica?.motivo_consulta,
      informe.evaluacion_psicopedagogica?.observaciones,
      informe.evaluacion_psicopedagogica?.informe_ia_generado,
    ];
    const totalChecks = checks.length;
    const filled = checks.filter((value) => Boolean(value && String(value).trim())).length;
    return Math.round((filled / totalChecks) * 100);
  };

  if (loading) {
    return <Spinner variant="centered" />;
  }

  if (total === 0 && informes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes informes creados
          </h3>
          <p className="text-gray-500 mb-6">
            Comienza creando tu primer informe psicopedagogico
          </p>
          <Link href="/profile/generar-informe">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Informe
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Mis Informes
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona todos tus informes psicopedagogicos
            </p>
          </div>
          <Link href="/profile/generar-informe">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Informe
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900/80">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {resumen.total}
              </span>
              <FileText className="h-5 w-5 text-emerald-600" />
            </CardContent>
          </Card>
          <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900/80">
                Completados
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {resumen.completados}
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </CardContent>
          </Card>
          <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900/80">
                Borradores
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {resumen.borradores}
              </span>
              <Clock3 className="h-5 w-5 text-emerald-600" />
            </CardContent>
          </Card>
          <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900/80">
                Otros estados
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {resumen.otros}
              </span>
              <Badge variant="secondary">Estado</Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por alumno o centro..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="borrador">Borradores</SelectItem>
                    <SelectItem value="completado">Completados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:w-48">
                <Select value={orden} onValueChange={setOrden}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recientes">Mas recientes</SelectItem>
                    <SelectItem value="antiguos">Mas antiguos</SelectItem>
                    <SelectItem value="actualizados">
                      Ultima actualizacion
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:w-40">
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Por pagina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 por pagina</SelectItem>
                    <SelectItem value="12">12 por pagina</SelectItem>
                    <SelectItem value="24">24 por pagina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:w-40">
                <Select value={vista} onValueChange={(value) => setVista(value as "cards" | "list")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cards">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        <span>Tarjetas</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="list">
                      <div className="flex items-center gap-2">
                        <List className="h-4 w-4" />
                        <span>Lista</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(busqueda || filtroEstado !== "todos") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setBusqueda("");
                    setFiltroEstado("todos");
                  }}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {informes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron informes
            </h3>
            <p className="text-gray-500">Intenta ajustar los filtros de busqueda</p>
            {(busqueda || filtroEstado !== "todos") && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setBusqueda("");
                  setFiltroEstado("todos");
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>
                Mostrando {informes.length} de {total}
              </span>
              <span>
                {filtroEstado === "todos"
                  ? "Todos los estados"
                  : `Estado: ${filtroEstado}`}
              </span>
            </div>
            {vista === "cards" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {informes.map((informe) => (
                  <Card
                    key={informe.id}
                    className="border-emerald-100/70 bg-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50/40"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {informe.datos_identificativos?.alumno?.nombre ||
                              "Sin nombre"}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {informe.datos_identificativos?.centro?.nombre ||
                              "Sin centro"}{" "}
                            {informe.datos_identificativos?.alumno?.curso ||
                              "Sin curso"}
                          </p>
                        </div>
                        <div className="ml-2">
                          {getEstadoBadge(informe.estado)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {informe.evaluacion_psicopedagogica?.motivo_consulta ||
                            "Sin motivo especificado"}
                        </p>

                        {informe.estado === "borrador" && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Progreso</span>
                              <span>{calcularProgreso(informe)}%</span>
                            </div>
                            <Progress value={calcularProgreso(informe)} className="h-2" />
                          </div>
                        )}

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Creado: {formatearFecha(informe.creado_en)}
                          </span>
                          <span>
                            Modificado: {formatearFecha(informe.actualizado_en)}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {informes.map((informe) => (
                  <Card
                    key={informe.id}
                    className="border-emerald-100/70 bg-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50/40"
                  >
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-semibold text-gray-900">
                            {informe.datos_identificativos?.alumno?.nombre ||
                              "Sin nombre"}
                          </span>
                          {getEstadoBadge(informe.estado)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {informe.datos_identificativos?.centro?.nombre ||
                            "Sin centro"}{" "}
                          {informe.datos_identificativos?.alumno?.curso ||
                            "Sin curso"}
                        </p>
                        {informe.estado === "borrador" && (
                          <div className="max-w-xs space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Progreso</span>
                              <span>{calcularProgreso(informe)}%</span>
                            </div>
                            <Progress value={calcularProgreso(informe)} className="h-2" />
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Creado: {formatearFecha(informe.creado_en)} ·
                          Modificado: {formatearFecha(informe.actualizado_en)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm">
              <span className="text-muted-foreground">
                Pagina {page} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InformesPage() {
  return (
    <Suspense fallback={<Spinner variant="centered" />}>
      <InformesContent />
    </Suspense>
  );
}
