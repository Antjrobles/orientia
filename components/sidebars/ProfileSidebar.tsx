'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { LayoutDashboard, FilePlus2, FolderKanban, Shield } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const sidebarNavItems = [
  {
    title: "Panel Principal",
    href: "/profile",
    icon: LayoutDashboard,
  },
  {
    title: "Nuevo Informe", 
    href: "/profile/generar-informe",
    icon: FilePlus2,
  },
  {
    title: "Mis Informes",
    href: "/profile/informes", 
    icon: FolderKanban,
  },
]

export function ProfileSidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isAdmin = session?.user?.role === 'admin'

  console.log("ProfileSidebar rendering with items:", sidebarNavItems)
  console.log("Current pathname:", pathname)
  console.log("Session:", session)

  return (
    <Sidebar className="border-r bg-white">
      <SidebarContent className="pt-6 px-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Navegación</h2>
          <SidebarMenu className="space-y-1">
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/profile" && pathname.startsWith(item.href))
              console.log(`Item ${item.title}: href=${item.href}, isActive=${isActive}`)
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive}
                    className="w-full justify-start"
                  >
                    <Link href={item.href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/admin")}
                  className="w-full justify-start"
                >
                  <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-red-50 text-red-600">
                    <Shield className="h-4 w-4" />
                    <span>Administración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
