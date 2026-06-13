import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { LayoutDashboard, Users, Building2, ChevronLeft } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  })
  
  if (user?.role !== "ADMIN") {
    // Standard user trying to access admin, bounce them out
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to App
          </Link>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Portal
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <LayoutDashboard className="h-5 w-5" />
            Overview
          </Link>
          <Link 
            href="/admin/users" 
            className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Users className="h-5 w-5" />
            Users
          </Link>
          <Link 
            href="/admin/companies" 
            className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Building2 className="h-5 w-5" />
            Companies
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
