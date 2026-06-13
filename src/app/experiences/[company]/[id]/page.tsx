import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { ArrowLeft, Building, Calendar, UserCircle, Target, Lightbulb, Code2, HelpCircle } from "lucide-react"
import { StarRating } from "@/components/experiences/star-rating"
import { VoteButtons } from "@/components/experiences/vote-buttons"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ExperienceDetailsPage({
  params
}: {
  params: { company: string, id: string }
}) {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const experience = await prisma.experience.findUnique({
    where: { id: params.id },
    include: {
      company: true,
      user: true,
      votes: { where: { userId: user.id } },
    }
  })

  if (!experience) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-2xl font-bold mb-2">Experience Not Found</h3>
        <Link href="/experiences" className="text-primary hover:underline">Return to Repository</Link>
      </div>
    )
  }

  const relatedExperiences = await prisma.experience.findMany({
    where: { 
      companyId: experience.companyId,
      id: { not: experience.id }
    },
    include: { company: true, user: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-start gap-6">
        <div className="pt-1">
          <VoteButtons 
            experienceId={experience.id} 
            initialUpvotes={experience.upvotes} 
            initialUserVote={experience.votes?.[0]?.value} 
          />
        </div>
        <div>
          <Link href={`/experiences/${encodeURIComponent(experience.company.name)}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {experience.company.name}
          </Link>
          
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">{experience.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href={`/experiences/${encodeURIComponent(experience.company.name)}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Building className="size-4" />
            {experience.company.name}
          </Link>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50 text-muted-foreground bg-white/40 dark:bg-white/5 backdrop-blur">
            <Target className="size-4" />
            {experience.role}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground">
            <Calendar className="size-4" />
            {experience.year}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-muted-foreground uppercase tracking-wider text-xs font-bold">Difficulty</span>
            <StarRating value={experience.difficulty} readonly />
          </div>
        </div>
        </div>
      </div>

      <div className="flex items-center gap-3 py-4 border-y border-border/40">
        <div className="size-10 rounded-full bg-secondary flex items-center justify-center">
          <UserCircle className="size-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium leading-none">{experience.isAnonymous ? "Anonymous User" : experience.user?.name || "Student"}</p>
          <p className="text-xs text-muted-foreground mt-1">Posted on {new Date(experience.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {experience.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {experience.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-8 mt-8">
        <section>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-4">
            <Target className="text-primary size-6" />
            Overall Experience
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-clay-light dark:shadow-none whitespace-pre-wrap leading-relaxed">
            {experience.content}
          </div>
        </section>

        {experience.oaQuestions && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-4">
              <Code2 className="text-blue-500 size-6" />
              Online Assessment
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none bg-blue-500/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 whitespace-pre-wrap leading-relaxed shadow-sm">
              {experience.oaQuestions}
            </div>
          </section>
        )}

        {experience.interviewQuestions && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-4">
              <HelpCircle className="text-purple-500 size-6" />
              Interview Questions
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none bg-purple-500/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 whitespace-pre-wrap leading-relaxed shadow-sm">
              {experience.interviewQuestions}
            </div>
          </section>
        )}

        {experience.tips && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-4">
              <Lightbulb className="text-yellow-500 size-6" />
              Preparation Tips
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none bg-yellow-500/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 whitespace-pre-wrap leading-relaxed shadow-sm">
              {experience.tips}
            </div>
          </section>
        )}
      </div>

      {relatedExperiences.length > 0 && (
        <section className="pt-12 mt-12 border-t border-border/40">
          <h2 className="text-2xl font-bold tracking-tight mb-6">More from {experience.company.name}</h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {relatedExperiences.map((rel) => (
              <Link href={`/experiences/${encodeURIComponent(rel.company.name)}/${rel.id}`} key={rel.id}>
                <Card className="h-full bg-white/40 dark:bg-white/5 backdrop-blur hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer border-white/20 dark:border-white/10 shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base line-clamp-2 leading-tight mb-2">{rel.title}</CardTitle>
                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/30">
                      <span className="text-xs text-muted-foreground font-medium">{rel.role}</span>
                      <StarRating value={rel.difficulty} readonly />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
