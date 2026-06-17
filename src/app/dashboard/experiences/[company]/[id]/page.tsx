import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import {
  ArrowLeft,
  Building,
  Calendar,
  UserCircle,
  Target,
  Lightbulb,
  Code2,
  HelpCircle,
} from 'lucide-react';
import { StarRating } from '@/components/experiences/star-rating';
import { VoteButtons } from '@/components/experiences/vote-buttons';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ExperienceDetailsPage({
  params,
}: {
  params: Promise<{ company: string; id: string }>;
}) {
  const resolvedParams = await params;
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const experience = await prisma.experience.findUnique({
    where: { id: resolvedParams.id },
    include: {
      company: true,
      user: true,
      votes: { where: { userId: user.id } },
      assessmentQuestions: { orderBy: { order: 'asc' } },
      interviewQuestions: { orderBy: { order: 'asc' } },
    },
  });

  if (!experience) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="mb-2 text-2xl font-bold">Experience Not Found</h3>
        <Link
          href="/dashboard/experiences"
          className="text-primary hover:underline"
        >
          Return to Repository
        </Link>
      </div>
    );
  }

  const relatedExperiences = await prisma.experience.findMany({
    where: {
      companyId: experience.companyId,
      id: { not: experience.id },
    },
    include: { company: true, user: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="flex items-start gap-6">
        <div className="pt-1">
          <VoteButtons
            experienceId={experience.id}
            initialUpvotes={experience.upvotes}
            initialUserVote={experience.votes?.[0]?.value}
          />
        </div>
        <div>
          <Link
            href={`/dashboard/experiences/${encodeURIComponent(experience.company.name)}`}
            className="text-muted-foreground hover:text-primary mb-6 inline-flex items-center text-sm font-medium transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {experience.company.name}
          </Link>

          <h1 className="mb-4 text-4xl leading-tight font-extrabold tracking-tight">
            {experience.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <Link
              href={`/dashboard/experiences/${encodeURIComponent(experience.company.name)}`}
              className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors"
            >
              <Building className="size-4" />
              {experience.company.name}
            </Link>
            <span className="border-border/50 text-muted-foreground flex items-center gap-1.5 rounded-md border bg-white/40 px-3 py-1.5 backdrop-blur dark:bg-white/5">
              <Target className="size-4" />
              {experience.role}
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5 rounded-md px-3 py-1.5">
              <Calendar className="size-4" />
              {experience.year}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Difficulty
              </span>
              <StarRating value={experience.difficulty} readonly />
            </div>
          </div>
        </div>
      </div>

      <div className="border-border/40 flex items-center gap-3 border-y py-4">
        <div className="bg-secondary flex size-10 items-center justify-center rounded-full">
          <UserCircle className="text-muted-foreground size-6" />
        </div>
        <div>
          <p className="leading-none font-medium">
            {experience.isAnonymous
              ? 'Anonymous User'
              : experience.user?.name || 'Student'}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Posted on {new Date(experience.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {experience.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {experience.tags.map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Target className="text-primary size-6" />
            Overall Experience
          </h2>
          <div className="prose prose-neutral dark:prose-invert shadow-clay-light max-w-none rounded-2xl border border-white/20 bg-white/40 p-6 leading-relaxed whitespace-pre-wrap backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            {experience.content}
          </div>
        </section>

        {experience.assessmentQuestions.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Code2 className="size-6 text-blue-500" />
              Online Assessment
            </h2>
            <div className="space-y-4">
              {experience.assessmentQuestions.map((q, i) => (
                <div
                  key={q.id}
                  className="prose prose-neutral dark:prose-invert max-w-none rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 shadow-sm backdrop-blur-xl"
                >
                  <div className="mb-2 font-semibold text-blue-500">
                    Question {i + 1}
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {q.questionText}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.interviewQuestions.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight">
              <HelpCircle className="size-6 text-purple-500" />
              Interview Questions
            </h2>
            <div className="space-y-4">
              {experience.interviewQuestions.map((q, i) => (
                <div
                  key={q.id}
                  className="prose prose-neutral dark:prose-invert max-w-none rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 shadow-sm backdrop-blur-xl"
                >
                  <div className="mb-2 font-semibold text-purple-500">
                    Question {i + 1}
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {q.questionText}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.tips && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Lightbulb className="size-6 text-yellow-500" />
              Preparation Tips
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 leading-relaxed whitespace-pre-wrap shadow-sm backdrop-blur-xl">
              {experience.tips}
            </div>
          </section>
        )}
      </div>

      {relatedExperiences.length > 0 && (
        <section className="border-border/40 mt-12 border-t pt-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            More from {experience.company.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {relatedExperiences.map((rel) => (
              <Link
                href={`/experiences/${encodeURIComponent(rel.company.name)}/${rel.id}`}
                key={rel.id}
              >
                <Card className="h-full cursor-pointer border-white/20 bg-white/40 shadow-sm backdrop-blur transition-colors hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                  <CardHeader className="p-4">
                    <CardTitle className="mb-2 line-clamp-2 text-base leading-tight">
                      {rel.title}
                    </CardTitle>
                    <div className="border-border/30 mt-auto flex items-center justify-between border-t pt-2">
                      <span className="text-muted-foreground text-xs font-medium">
                        {rel.role}
                      </span>
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
  );
}
