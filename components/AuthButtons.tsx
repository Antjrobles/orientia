'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut } from 'lucide-react'
import Image from 'next/image'

export default function AuthButtons() {
  const { data: session, status } = useSession()

  // Muestra un estado de carga para evitar parpadeos (flickering)
  if (status === 'loading') {
    return (
      <Button variant='outline' size='sm' disabled>
        ...
      </Button>
    )
  }

  // Si el usuario ha iniciado sesión
  if (session && session.user) {
    return (
      <div className='flex items-center gap-3'>
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || 'Avatar del usuario'}
            width={32}
            height={32}
            className='rounded-full border'
          />
        )}
        <Button onClick={() => signOut()} variant='ghost' size='sm'>
          <LogOut className='mr-2 h-4 w-4' />
          Cerrar Sesión
        </Button>
      </div>
    )
  }

  // Si el usuario no ha iniciado sesión
  return (
    <Button onClick={() => signIn('google')} variant='default'>
      <LogIn className='mr-2 h-4 w-4' />
      Acceder
    </Button>
  )
}
