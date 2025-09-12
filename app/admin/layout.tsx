import ProfileHeader from "@/components/headers/ProfileHeader";
import { ProfileSidebar } from "@/components/sidebars/ProfileSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DynamicBreadcrumb from '@/components/navigation/DynamicBreadcrumb';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protegemos toda la sección de administración
  if (session?.user?.role !== 'admin') {
    redirect('/profile');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <DynamicBreadcrumb />
      <SidebarProvider>
        <div className="container mx-auto">
          <div className="flex py-10 gap-10">
            <ProfileSidebar />
            <SidebarInset className="flex-1">
              <div className="flex h-12 items-center gap-2 px-4 mb-6">
                <SidebarTrigger />
              </div>
              <main id="main" role="main" tabIndex={-1}>{children}</main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
