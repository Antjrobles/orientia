import ProfileHeader from "@/components/headers/ProfileHeader";
import { ProfileSidebar } from "@/components/sidebars/ProfileSidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProfileHeader />
      <div className="container mx-auto flex-1 py-10">
        <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-10">
          {/* Sidebar solo visible en escritorio */}
          <div className="hidden md:block">
            <ProfileSidebar />
          </div>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
