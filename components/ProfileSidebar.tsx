'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { LayoutDashboard, FilePlus2, FolderKanban, Settings, Shield } from "lucide-react"

const sidebarNavItems = [
  {
    title: "Panel Principal",
    href: "/profile",
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
  },
  {
    title: "Nuevo Informe",
    href: "/nuevo-informe",
    icon: <FilePlus2 className="h-4 w-4 mr-2" />,
  },
  {
    title: "Mis Informes",
    href: "/profile/informes",
    icon: <FolderKanban className="h-4 w-4 mr-2" />,
    disabled: true, // Deshabilitado por ahora
  },
]

export function ProfileSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  return (
    <aside>
      <nav className="flex flex-col space-y-1">
        {sidebarNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              // Mejora: El botón activo ahora es verde para ser consistente con el tema.
              pathname === item.href
                ? "bg-green-600 text-white hover:bg-green-700"
                : "hover:bg-gray-100",
              "w-full justify-start",
              item.disabled && "cursor-not-allowed opacity-50"
            )}
            aria-disabled={item.disabled}
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
        {isAdmin && (
          <Link
            key="/admin"
            href="/admin"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname.startsWith("/admin")
                ? "bg-red-50 text-red-600 hover:bg-red-100 font-semibold"
                : "text-red-600 hover:bg-red-50 hover:text-red-700",
              "w-full justify-start"
            )}
          >
            <Shield className="h-4 w-4 mr-2" />
            Administración
          </Link>
        )}
      </nav>
    </aside>
  )
}
