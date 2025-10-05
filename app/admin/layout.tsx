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
    </div>
  );
}
