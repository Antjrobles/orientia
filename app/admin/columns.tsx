'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/ui/avatar'

// Tipo actualizado para coincidir con el esquema de la tabla 'users'.
// Se ha eliminado 'created_at'.
export type User = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: 'admin' | 'usuario'
}

// Componente reutilizable para cabeceras de columna con ordenación
const DataTableColumnHeader = ({ column, title }: { column: any; title: string }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    accessorKey: 'email',
    // Ahora ordenamos por email, ya que es un campo único y fiable
    header: ({ column }) => <DataTableColumnHeader column={column} title="Usuario" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} image={user.image} className="h-10 w-10" />
          <div className="grid gap-1">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      // Asumiendo que los roles en la DB son 'admin' y 'usuario'
      const variant = role === 'admin' ? 'destructive' : 'secondary'
      return <Badge variant={variant} className="capitalize">{role}</Badge>
    },
  },
  // --- COLUMNA ELIMINADA ---
  // Se ha quitado la columna 'created_at' porque no existe en la tabla 'users'.
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                Copiar ID de usuario
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ver perfil</DropdownMenuItem>
              <DropdownMenuItem>Editar rol</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Eliminar usuario</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]