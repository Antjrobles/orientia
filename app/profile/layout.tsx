import ProfileHeader from "@/components/headers/ProfileHeader"
import { ProfileSidebar } from "@/components/sidebars/ProfileSidebar"

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProfileHeader />
      <div className="container mx-auto flex-1 py-10">
        <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-10">
          <aside className="hidden md:block">
            <ProfileSidebar />
          </aside>
          <main id="main" role="main" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
