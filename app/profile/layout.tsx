import ProfileHeader from "@/components/headers/ProfileHeader"
import { ProfileSidebar } from "@/components/sidebars/ProfileSidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import DynamicBreadcrumb from '@/components/navigation/DynamicBreadcrumb'

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
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
              <main id="main" role="main" tabIndex={-1}>
                {children}
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
