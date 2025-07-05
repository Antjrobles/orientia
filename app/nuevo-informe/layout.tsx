import ProfileHeader from "@/components/ProfileHeader"
import { ProfileSidebar } from "@/components/ProfileSidebar"

export default function NuevoInformeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProfileHeader />
      <div className="container mx-auto flex-1 py-10">
        <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-10">
          <ProfileSidebar />
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}

