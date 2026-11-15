import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { InteractiveAppBackdrop } from "@/components/dashboard/interactive-app-backdrop"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full bg-[var(--bg-canvas)] text-foreground selection:bg-primary/20 overflow-x-clip">
        {/* Living Interactive Backdrop */}
        <InteractiveAppBackdrop />

        <div className="relative z-10 flex min-h-screen w-full">
          {/* Desktop & Tablet Sidebar */}
          <Sidebar />

          <div className="flex flex-1 flex-col min-w-0">
            {/* Top Utility Bar (56px) */}
            <Topbar />
            
            {/* Main Content Area with 180ms Page Enter Transition */}
            <main className="flex-1 bg-transparent animate-page-enter">
              <div className="mx-auto w-full max-w-6xl p-4 md:p-8 pb-24 md:pb-12">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Fixed Bottom Navigation Bar (< 768px) */}
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  )
}
