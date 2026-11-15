import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { NewApplicationButton } from "@/components/applications/new-application-button"
import { PageHeader } from "@/components/dashboard/page-header"
import { ApplicationsView } from "@/components/applications/applications-view"

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
    <div className="flex flex-col space-y-6 pb-12 animate-page-enter">
      <PageHeader
        title="Applications Tracker"
        subtitle="Manage and track all the roles, assessments, and interview stages you have applied for."
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-muted-foreground">
            {applications.length} {applications.length === 1 ? "role" : "roles"}
          </span>
        }
        actions={<NewApplicationButton />}
      />

      <ApplicationsView initialApplications={applications} />
    </div>
  )
}
