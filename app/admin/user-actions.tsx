'use client'

import * as React from 'react'
import { MoreHorizontal, Trash2, Edit, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteUser, updateUserRole } from './actions'
import type { User } from './columns'

interface UserActionsProps {
  user: User
}

export function UserActions({ user }: UserActionsProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition()
  const [isUpdatePending, startUpdateTransition] = React.useTransition()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  const handleRoleChange = (newRole: 'admin' | 'usuario') => {
    startUpdateTransition(async () => {
      const result = await updateUserRole(user.id, newRole)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteUser(user.id)
      if (result.success) {
        toast.success(result.message)
        setIsDeleteDialogOpen(false)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario{' '}
              <span className="font-semibold">{user.name || user.email}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeletePending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletePending ? 'Eliminando...' : 'Sí, eliminar usuario'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copiar ID de usuario</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger><Edit className="mr-2 h-4 w-4" /><span>Editar rol</span></DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleRoleChange('admin')} disabled={user.role === 'admin' || isUpdatePending}><UserCheck className="mr-2 h-4 w-4" /><span>Hacer Administrador</span></DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange('usuario')} disabled={user.role === 'usuario' || isUpdatePending}><UserX className="mr-2 h-4 w-4" /><span>Hacer Usuario</span></DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setIsDeleteDialogOpen(true)}><Trash2 className="mr-2 h-4 w-4" /><span>Eliminar usuario</span></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
