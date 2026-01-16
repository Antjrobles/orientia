"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAvatar } from "@/components/ui/avatar";
import { UserActions } from "./user-actions";

// Tipo actualizado para coincidir con el esquema de la tabla 'users'.
// Se ha eliminado 'created_at'.
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "admin" | "usuario";
  emailVerified?: string | null;
  reportsCount?: number;
  lastReportAt?: string | null;
  trustedDevicesCount?: number;
};

// Componente reutilizable para cabeceras de columna con ordenación
const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
}: {
  column: Column<TData, TValue>;
  title: string;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    // Ahora ordenamos por email, ya que es un campo único y fiable
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <UserAvatar
            name={user.name}
            image={user.image}
            className="h-10 w-10"
          />
          <div className="grid gap-1">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const isAdmin = role === "admin";
      return (
        <Badge
          variant="outline"
          className={`capitalize border ${
            isAdmin
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          <span
            className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
              isAdmin ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Email verificado",
    cell: ({ row }) => {
      const verified = Boolean(row.getValue("emailVerified"));
      return (
        <Badge
          variant="outline"
          className={`border ${
            verified
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {verified ? "Verificado" : "Sin verificar"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reportsCount",
    header: "Informes",
    cell: ({ row }) => {
      const count = row.getValue("reportsCount") as number | undefined;
      return <span className="text-sm font-medium">{count ?? 0}</span>;
    },
  },
  {
    accessorKey: "lastReportAt",
    header: "Ultimo informe",
    cell: ({ row }) => {
      const value = row.getValue("lastReportAt") as string | null | undefined;
      if (!value) return <span className="text-sm text-muted-foreground">-</span>;
      const date = new Date(value);
      const label = Number.isNaN(date.getTime())
        ? "-"
        : date.toLocaleDateString("es-ES");
      return <span className="text-sm">{label}</span>;
    },
  },
  // --- COLUMNA ELIMINADA ---
  // Se ha quitado la columna 'created_at' porque no existe en la tabla 'users'.
  {
    id: "actions",
    cell: ({ row }) => {
      return <UserActions user={row.original} />;
    },
  },
];
