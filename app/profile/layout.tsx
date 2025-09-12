import ProfileHeader from "@/components/headers/ProfileHeader"
import { ProfileSidebar } from "@/components/sidebars/ProfileSidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import DynamicBreadcrumb from '@/components/navigation/DynamicBreadcrumb'
import BackToTopButton from '@/components/navigation/BackToTopButton';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <DynamicBreadcrumb />
      <SidebarProvider style={{"--sidebar-width": "13rem"} as any}>
        <div className="container mx-auto bg-gray-50">
          <div className="flex py-10 gap-10">
            <ProfileSidebar />
            <SidebarInset className="flex-1 bg-gray-50"><main id="main" role="main" tabIndex={-1}>
                {children}
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
      <BackToTopButton />
    </div>
  );
}
