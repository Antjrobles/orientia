'use client'

import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Filter, FileText, Eye, Edit, Copy, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";


function InformesContent() {
  const { data: session } = useSession();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [informes, setInformes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        const response = await fetch('/api/informes/list');
        const data = await response.json();

        if (data.success) {
          setInformes(data.informes);
        }
      } catch (error) {
        console.error('Error al cargar informes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchInformes();
    }
  }, [session]);

  // Filtrar informes
  const informesFiltrados = informes.filter(informe => {
    const alumnoNombre = informe.datos_identificativos?.alumno?.nombre || '';
    const centroNombre = informe.datos_identificativos?.centro?.nombre || '';

    const coincideBusqueda = alumnoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      centroNombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || informe.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completado</Badge>;
      case 'borrador':
        return <Badge variant="secondary">Borrador</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (informesFiltrados.length === 0 && informes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes informes creados</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primer informe psicopedagógico</p>
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
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mis Informes</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona todos tus informes psicopedagógicos
            </p>
          </div>
          <Link href="/profile/generar-informe">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Informe
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Lista de informes */}
        {informesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron informes</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {informesFiltrados.map((informe) => (
              <Card key={informe.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {informe.datos_identificativos?.alumno?.nombre || 'Sin nombre'}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {informe.datos_identificativos?.centro?.nombre || 'Sin centro'} • {informe.datos_identificativos?.alumno?.curso || 'Sin curso'}
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
                      {informe.evaluacion_psicopedagogica?.motivo_consulta || 'Sin motivo especificado'}
                    </p>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Creado: {formatearFecha(informe.creado_en)}</span>
                      <span>Modificado: {formatearFecha(informe.actualizado_en)}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InformesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <InformesContent />
    </Suspense>
  );
}