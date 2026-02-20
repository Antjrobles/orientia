"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchX } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<
  TData extends { name?: string | null; email?: string | null },
  TValue = unknown,
>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState(""); // Usamos un estado simple para el filtro global
  const [rowSelection, setRowSelection] = React.useState({});
  const [density, setDensity] = React.useState<"comfortable" | "compact">(
    "comfortable",
  );

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const name = (row.original.name ?? "").toLowerCase();
      const email = (row.original.email ?? "").toLowerCase();
      const value = (filterValue as string).toLowerCase();
      return name.includes(value) || email.includes(value);
    },
  });

  const hasFilter = globalFilter.trim().length > 0;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const totalRows = table.getCoreRowModel().rows.length;
  const emptyTitle = hasFilter ? "Sin resultados" : "Sin usuarios";
  const emptyDescription = hasFilter
    ? "No hay coincidencias con tu busqueda."
    : "Aun no hay usuarios para mostrar.";
  const cellPadding = density === "compact" ? "py-2" : "py-4";
  const headPadding = density === "compact" ? "py-2" : "py-3";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Buscar por nombre o email..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full sm:w-64"
          />
          {hasFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlobalFilter("")}
            >
              Limpiar
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>
            {filteredRows} de {totalRows} usuarios
          </span>
          <div className="flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50/60 p-1">
            <Button
              variant={density === "comfortable" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setDensity("comfortable")}
            >
              Normal
            </Button>
            <Button
              variant={density === "compact" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setDensity("compact")}
            >
              Denso
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table
          className="w-full"
          style={{ width: table.getTotalSize(), minWidth: "100%" }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`${headPadding} relative`}
                    style={{
                      width: header.getSize(),
                      minWidth: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => header.column.resetSize()}
                        className={`absolute right-0 top-0 z-20 h-full w-2 cursor-col-resize select-none touch-none transition-colors ${
                          header.column.getIsResizing()
                            ? "bg-emerald-500"
                            : "bg-transparent hover:bg-emerald-300/70"
                        }`}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="transition-colors hover:bg-emerald-50/60 focus-within:bg-emerald-50/70"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cellPadding}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                    <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
                      <SearchX className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {emptyTitle}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {emptyDescription}
                    </div>
                    {hasFilter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGlobalFilter("")}
                      >
                        Limpiar filtro
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
