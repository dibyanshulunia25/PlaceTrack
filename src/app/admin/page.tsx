import { checkRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  // We already have edge middleware protecting this route, but it's good practice 
  // to also check roles in Server Components directly, as middleware can be bypassed internally.
  const isAdmin = await checkRole('ADMIN')

  if (!isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, Admin. This page is only visible to users with the ADMIN role.
      </p>
    </div>
  )
}
