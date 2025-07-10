'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, User, Settings, LayoutDashboard, FilePlus2 } from 'lucide-react'
import Image from 'next/image'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { useRouter } from 'next/navigation'


interface AuthButtonsProps {
  className?: string
}

export default function AuthButtons({ className }: AuthButtonsProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
    )
  }

  if (session && session.user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Link href="/profile" passHref >
          <Button variant="ghost" className="mr-2">
            <User className="h-4 w-4 mr-2" />
            Mi Cuenta
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Image
                src={session.user.image || '/default-avatar.png'}
                alt={session.user.name || 'Avatar del usuario'}
                fill
                sizes="36px"
                className='rounded-full object-cover'
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 z-[110]" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Panel</span></Link>
            </DropdownMenuItem>
            {/* Añadido: Acción principal dentro del menú */}
            <DropdownMenuItem asChild>
              <Link href="/nuevo-informe"><FilePlus2 className="mr-2 h-4 w-4" /><span>Nuevo Informe</span></Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile/settings" className="cursor-not-allowed opacity-50"><Settings className="mr-2 h-4 w-4" /><span>Configuración</span></Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <ShimmerButton onClick={() => router.push('/login')} className={className}>
      <LogIn className='mr-2 h-4 w-4' />
      Acceder
    </ShimmerButton>
  )
}
