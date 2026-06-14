import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-surface text-foreground selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Mobile Nav & Topbar */}
        <Topbar />
        
        {/* Main Content Area */}
        <main className="flex-1 bg-surface">
          <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
