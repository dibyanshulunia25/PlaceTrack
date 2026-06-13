import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ExperienceCard } from '@/components/experiences/experience-card'
import { NewExperienceButton } from '@/components/experiences/new-experience-button'
import { BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ExperiencesPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const experiences = await prisma.experience.findMany({
    include: {
      company: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Experiences Hub</h1>
          <p className="text-muted-foreground">
            Read interview experiences from others or share your own to help the community.
          </p>
        </div>
        <NewExperienceButton />
      </div>

      {experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur-md">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-clay-inset">
            <BookOpen className="size-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No experiences documented yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Be the first to share your interview experience and help others prepare!
          </p>
          <NewExperienceButton />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      )}
    </div>
  )
}
