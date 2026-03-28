import { SidebarNav } from '@/components/sidebar-nav'
import { TopNavbar } from '@/components/top-navbar'
import { UploadsProvider } from '@/components/uploads-provider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#c4d8c0] dark:bg-[#8aa886] p-3 md:p-4">
      <div className="flex h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)] overflow-hidden bg-background rounded-3xl shadow-2xl">
        <UploadsProvider>
          <SidebarNav />
          <div className="flex flex-col flex-1 overflow-hidden">
            <TopNavbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </UploadsProvider>
      </div>
    </div>
  )
}
