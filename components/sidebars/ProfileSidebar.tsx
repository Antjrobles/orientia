"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  FolderKanban,
  ClipboardList,
  CheckCircle2,
  Shield,
  Mail,
  User,
  Lock,
  SlidersHorizontal,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const sidebarGroups = [
  {
    label: "Cuenta",
    items: [
      {
        title: "Panel",
        href: "/profile",
        icon: LayoutDashboard,
      },
      {
        title: "Perfil y datos",
        href: "/profile/ajustes",
        icon: User,
      },
      {
        title: "Seguridad",
        href: "/profile/seguridad",
        icon: Lock,
      },
      {
        title: "Preferencias",
        href: "/profile/preferencias",
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    label: "Herramientas",
    items: [
      {
        title: "Nuevo informe",
        href: "/profile/generar-informe",
        icon: FilePlus2,
      },
      {
        title: "Intervenciones",
        href: "/profile/intervenciones",
        icon: FileText,
      },
    ],
  },
  {
    label: "Informes",
    items: [
      {
        title: "Mis informes",
        href: "/profile/informes",
        icon: FolderKanban,
      },
      {
        title: "Borradores",
        href: "/profile/informes?estado=borrador",
        icon: ClipboardList,
      },
      {
        title: "Completados",
        href: "/profile/informes?estado=completado",
        icon: CheckCircle2,
      },
    ],
  },
];

export function ProfileSidebar() {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();
  const { isMobile, setOpenMobile } = useSidebar();
  const isAdmin = session?.user?.role === "admin";

  const handleMobileNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar
      collapsible="icon"
      scroll="page"
      className="border-r border-border bg-sidebar"
    >
      <SidebarHeader className="relative z-[60] flex h-11 items-center justify-end border-b border-border bg-muted/40 px-4">
        <SidebarTrigger
          aria-label="Contraer sidebar"
          className="h-8 w-8 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        />
      </SidebarHeader>
      <SidebarContent className="px-2 pt-2">
        <SidebarMenu className="space-y-3">
          {sidebarGroups.map((group) => (
            <SidebarGroup key={group.label} className="p-0">
              <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wide text-muted-foreground">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-1">
                {group.items.map((item) => {
                  const itemPath = item.href.split("?")[0];
                  const isActive =
                    pathname === itemPath ||
                    pathname.startsWith(`${itemPath}/`) ||
                    (itemPath === "/profile/informes" &&
                      pathname.startsWith("/profile/informes")) ||
                    (item.href === "/profile" && pathname === "/profile");
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
                          onClick={handleMobileNavClick}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0"
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
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          {isAdmin && (
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wide text-muted-foreground">
                Admin
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/admin"}
                    className="w-full justify-start"
                  >
                    <Link
                      href="/admin"
                      onClick={handleMobileNavClick}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Administracion
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/admin/comunicaciones")}
                    className="w-full justify-start"
                  >
                    <Link
                      href="/admin/comunicaciones"
                      onClick={handleMobileNavClick}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Comunicaciones
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
