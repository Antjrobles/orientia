import { getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/headers/ProfileHeader";
import { ProfileSidebar } from "@/components/sidebars/ProfileSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { DEVICE_COOKIE_NAME } from "@/lib/device";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
  const skipDeviceVerification = process.env.NODE_ENV === "development";
  if (skipDeviceVerification) {
    return (
      <div className="app-dark-scope min-h-screen overflow-x-hidden bg-background">
        <ProfileHeader />
        <SidebarProvider style={{ "--sidebar-width": "13rem" } as any}>
          <ProfileSidebar />
          <SidebarInset className="flex-1 overflow-x-hidden bg-background">
            <div className="px-4 pt-3 sm:px-6 lg:px-8 md:hidden">
              <SidebarTrigger
                aria-label="Abrir menú lateral"
                className="h-9 w-9 rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              />
            </div>
            <DynamicBreadcrumb />
            <div className="py-10 overflow-x-hidden">
              <main
                id="main"
                role="main"
                tabIndex={-1}
                className="overflow-x-hidden"
              >
                {children}
              </main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const deviceId = cookieStore.get(DEVICE_COOKIE_NAME)?.value;
  if (!deviceId) {
    redirect("/login?error=DeviceVerificationRequired");
  }

  const { data: trusted } = await supabase
    .from("trusted_devices")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("device_id", deviceId)
    .single();

  if (!trusted) {
    redirect("/login?error=DeviceVerificationRequired");
  }

  return (
    <div className="app-dark-scope min-h-screen overflow-x-hidden bg-background">
      <ProfileHeader />
      <SidebarProvider style={{ "--sidebar-width": "13rem" } as any}>
        <ProfileSidebar />
        <SidebarInset className="flex-1 overflow-x-hidden bg-background">
          <div className="px-4 pt-3 sm:px-6 lg:px-8 md:hidden">
            <SidebarTrigger
              aria-label="Abrir menú lateral"
              className="h-9 w-9 rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            />
          </div>
          <DynamicBreadcrumb />
          <div className="py-10 overflow-x-hidden">
            <main
              id="main"
              role="main"
              tabIndex={-1}
              className="overflow-x-hidden"
            >
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

