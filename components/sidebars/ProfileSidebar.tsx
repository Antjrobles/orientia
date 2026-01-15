"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, FilePlus2, FolderKanban, Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
];

export function ProfileSidebar() {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";

  return (
    <Sidebar collapsible="icon" className="border-r bg-white pt-[65px]">
      <SidebarHeader className="relative z-[60] h-11 px-4 border-b border-gray-200 bg-gray-50 flex items-center justify-end">
        <SidebarTrigger
          aria-label="Contraer sidebar"
          className="h-8 w-8 rounded-md text-gray-600 hover:bg-gray-100"
        />
      </SidebarHeader>
      <SidebarContent className="px-2 pt-2">
        <SidebarMenu className="space-y-1">
          {sidebarNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/profile" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="w-full justify-start"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-green-50 data-[active=true]:text-green-600 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:gap-0"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/admin")}
                className="w-full justify-start"
              >
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:gap-0"
                >
                  <Shield className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Administración
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
