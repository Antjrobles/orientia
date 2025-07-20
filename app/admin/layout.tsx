import ProfileHeader from "@/components/ProfileHeader";
import { ProfileSidebar } from "@/components/ProfileSidebar";
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
    <>
      <ProfileHeader />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-8 pb-12 pt-6 md:flex-row md:space-x-8 md:space-y-0">
          <aside className="md:w-1/4 lg:w-1/5"><ProfileSidebar /></aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}