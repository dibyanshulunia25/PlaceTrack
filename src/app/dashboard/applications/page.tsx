import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ApplicationCard } from "@/components/applications/application-card"
import { NewApplicationButton } from "@/components/applications/new-application-button"
import { FileText } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default async function ApplicationsPage() {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const applications = await prisma.application.findMany({
    where: {
      userId: user.id,
    },
    include: {
      company: true,
    },
    orderBy: {
      appliedAt: 'desc',
    },
  })

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Applications</h1>
          <p className="text-muted-foreground text-sm">
            Manage and track all the roles you have applied for.
          </p>
        </div>
        <NewApplicationButton />
      </div>

      {applications.length === 0 ? (
        <EmptyState 
          icon={FileText}
          title="No applications found"
          description="You haven't tracked any applications yet. Click the button above to add your first one!"
          action={<NewApplicationButton />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  )
}
