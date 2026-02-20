"use client";

import { type ComponentType, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  FilePlus2,
  FileText,
  Home,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Settings,
  Shield,
  SlidersHorizontal,
  User,
} from "lucide-react";

type PaletteItem = {
  href: string;
  label: string;
  group: "Principal" | "Perfil" | "Admin";
  icon: ComponentType<{ className?: string }>;
};

export default function GlobalCommandPalette() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const isAuthenticated = Boolean(session?.user);
  const isAdmin = session?.user?.role === "admin";

  const items = useMemo<PaletteItem[]>(() => {
    if (!isAuthenticated) {
      return [
        { href: "/", label: "Inicio", group: "Principal", icon: Home },
        { href: "/login", label: "Iniciar sesión", group: "Principal", icon: User },
      ];
    }

    const base: PaletteItem[] = [
      { href: "/profile", label: "Panel principal", group: "Principal", icon: LayoutDashboard },
      { href: "/profile/generar-informe", label: "Nuevo informe", group: "Principal", icon: FilePlus2 },
      { href: "/profile/informes", label: "Mis informes", group: "Principal", icon: FileText },
      { href: "/profile/intervenciones", label: "Intervenciones", group: "Principal", icon: MessageSquare },
      { href: "/profile/ajustes", label: "Perfil y datos", group: "Perfil", icon: Settings },
      { href: "/profile/seguridad", label: "Seguridad", group: "Perfil", icon: Lock },
      { href: "/profile/preferencias", label: "Preferencias", group: "Perfil", icon: SlidersHorizontal },
    ];

    if (isAdmin) {
      base.push(
        { href: "/admin", label: "Administración", group: "Admin", icon: Shield },
        { href: "/admin/comunicaciones", label: "Comunicaciones", group: "Admin", icon: MessageSquare },
      );
    }

    return base;
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const runCommand = (href: string) => {
    setOpen(false);
    if (href === pathname) return;
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar página o acción..." />
      <CommandList>
        <CommandEmpty>Sin resultados</CommandEmpty>
        <CommandGroup heading="Principal">
          {items
            .filter((item) => item.group === "Principal")
            .map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem key={item.href} onSelect={() => runCommand(item.href)}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              );
            })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Perfil">
          {items
            .filter((item) => item.group === "Perfil")
            .map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem key={item.href} onSelect={() => runCommand(item.href)}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              );
            })}
        </CommandGroup>
        {items.some((item) => item.group === "Admin") ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Admin">
              {items
                .filter((item) => item.group === "Admin")
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem key={item.href} onSelect={() => runCommand(item.href)}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      <CommandShortcut>↵</CommandShortcut>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
