import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ApplicationCard } from "@/components/applications/application-card"
import { NewApplicationButton } from "@/components/applications/new-application-button"
import { FileText } from "lucide-react"

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
        <div className="flex flex-col items-center justify-center p-12 mt-8 text-center border border-dashed rounded-2xl bg-muted/30">
          <FileText className="size-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No applications found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            You haven't tracked any applications yet. Click the button above to add your first one!
          </p>
        </div>
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
