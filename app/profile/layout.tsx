import ProfileHeader from "@/components/headers/ProfileHeader";
import { ProfileSidebar } from "@/components/sidebars/ProfileSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import BackToTopButton from "@/components/navigation/BackToTopButton";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <SidebarProvider style={{ "--sidebar-width": "13rem" } as any}>
        <ProfileSidebar />
        <SidebarInset className="flex-1 bg-gray-50">
          <DynamicBreadcrumb />
          <div className="py-10">
            <main id="main" role="main" tabIndex={-1}>
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <BackToTopButton />
    </div>
  );
}
