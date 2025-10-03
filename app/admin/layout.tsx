import ProfileHeader from "@/components/headers/ProfileHeader";
import { ProfileSidebar } from "@/components/sidebars/ProfileSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protegemos toda la sección de administración
  if (session?.user?.role !== "admin") {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <SidebarProvider style={{ "--sidebar-width": "13rem" } as any}>
        <ProfileSidebar />
        <SidebarInset className="flex-1 bg-gray-50">
          <DynamicBreadcrumb />
          <div className="container mx-auto">
            <div className="py-10">
              <main id="main" role="main" tabIndex={-1}>
                {children}
              </main>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
