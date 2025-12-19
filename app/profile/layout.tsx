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
import BackToTopButton from "@/components/navigation/BackToTopButton";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { DEVICE_COOKIE_NAME } from "@/lib/device";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const deviceId = cookies().get(DEVICE_COOKIE_NAME)?.value;
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <ProfileHeader />
      <SidebarProvider style={{ "--sidebar-width": "13rem" } as any}>
        <ProfileSidebar />
        <SidebarInset className="flex-1 bg-gray-50 overflow-x-hidden">
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
      <BackToTopButton />
    </div>
  );
}
