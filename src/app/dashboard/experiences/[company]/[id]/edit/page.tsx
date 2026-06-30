import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { ExperienceForm } from '@/components/experiences/experience-form';

export default async function EditExperiencePage({
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
      assessmentQuestions: { orderBy: { order: 'asc' } },
      interviewQuestions: { orderBy: { order: 'asc' } },
    },
  });

  if (!experience) {
    redirect('/dashboard/experiences');
  }

  if (experience.userId !== user.id) {
    redirect(`/dashboard/experiences/${encodeURIComponent(resolvedParams.company)}/${resolvedParams.id}`);
  }

  const technicalQs = experience.interviewQuestions.filter(q => q.type === 'TECHNICAL');
  const personalQs = experience.interviewQuestions.filter(q => q.type === 'PERSONAL');

  const initialData = {
    companyName: experience.company.name,
    role: experience.role,
    title: experience.title,
    year: experience.year,
    difficulty: experience.difficulty,
    content: experience.content,
    oaQuestions: experience.assessmentQuestions.map(q => ({ value: q.questionText })),
    technicalQuestions: technicalQs.map(q => ({ value: q.questionText })),
    personalQuestions: personalQs.map(q => ({ value: q.questionText })),
    tips: experience.tips || "",
    tags: experience.tags.join(", "),
    isPublic: experience.isPublic,
    isAnonymous: experience.isAnonymous,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Experience</h1>
        <p className="text-muted-foreground">
          Update your interview experience at {experience.company.name}.
        </p>
      </div>

      <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <ExperienceForm experienceId={experience.id} initialData={initialData} />
      </div>
    </div>
  );
}
