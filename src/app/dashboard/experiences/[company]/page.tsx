import { prisma } from '@/lib/prisma';
import { PublicExperienceCard } from '@/components/experiences/public-experience-card';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import {
  Building2,
  ArrowLeft,
  TrendingUp,
  HelpCircle,
  Star,
  Plus,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PaginationWrapper } from '@/components/experiences/pagination-wrapper';
import { getDifficultyBadge } from '@/lib/difficulty-utils';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export default async function CompanyExperiencesPage({
  params,
  searchParams,
}: {
  params: Promise<{ company: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const decodedCompany = decodeURIComponent(resolvedParams.company);
  const page =
    typeof resolvedSearchParams.page === 'string'
      ? parseInt(resolvedSearchParams.page)
      : 1;
  const limit = 12;

  const company = await prisma.company.findFirst({
    where: { name: { equals: decodedCompany, mode: 'insensitive' } },
    include: {
      experiences: {
        include: {
          user: true,
          company: true,
          assessmentQuestions: true,
          interviewQuestions: true,
          votes: { where: { userId: user.id } },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-12 text-center">
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
          <Building2 className="size-6" />
        </div>
        <h3 className="text-foreground text-2xl font-bold">
          Company Not Found
        </h3>
        <p className="text-muted-foreground max-w-sm text-sm">
          We couldn't find any experiences tracked for "{decodedCompany}".
        </p>
        <Link
          href="/dashboard/experiences"
          className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to All Companies</span>
        </Link>
      </div>
    );
  }

  const totalExperiences = company.experiences.length;
  const avgDifficulty =
    totalExperiences > 0
      ? company.experiences.reduce(
          (acc, exp) => acc + (exp.difficulty || 0),
          0
        ) / totalExperiences
      : 0;
  const diffBadge = getDifficultyBadge(avgDifficulty);

  const totalQuestions = company.experiences.reduce((acc, exp) => {
    return acc + exp.assessmentQuestions.length + exp.interviewQuestions.length;
  }, 0);

  // Offers shared
  const offersCount = company.experiences.filter(
    (e) => e.offerStatus && e.offerStatus.toLowerCase().includes('offer')
  ).length;
  const offerRateText =
    totalExperiences > 0
      ? `${Math.round((offersCount / totalExperiences) * 100)}%`
      : 'N/A';

  const paginatedExperiences = company.experiences.slice(
    (page - 1) * limit,
    page * limit
  );
  const totalPages = Math.ceil(totalExperiences / limit);

  return (
    <div className="animate-page-enter space-y-6 pb-12">
      {/* 1. Back Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/experiences"
          className="text-muted-foreground hover:text-foreground -ml-1 inline-flex items-center gap-2 rounded-lg p-1 text-xs font-semibold transition-colors hover:bg-[var(--bg-elevated)]"
        >
          <ArrowLeft className="size-4" />
          <span>All Companies</span>
        </Link>

        <Link
          href="/dashboard/experiences/new"
          className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors hover:bg-[var(--accent-primary-hover)]"
        >
          <Plus className="size-3.5" />
          <span>Share {company.name} Debrief</span>
        </Link>
      </div>

      {/* 2. Company Summary Banner Card */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-elevation-card)]">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="text-foreground flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-xl font-bold shadow-2xs">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{company.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
                  {company.name}
                </h1>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                    diffBadge.colorClass
                  )}
                >
                  <Star className="size-3 fill-current" />
                  <span>{diffBadge.label}</span>
                  <span className="text-[10px] opacity-80">
                    ({diffBadge.score})
                  </span>
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {company.industry || 'Technology & Engineering'} · Placement
                Intelligence Feed
              </p>
            </div>
          </div>
        </div>

        {/* 4-Stat Strip */}
        <div className="grid grid-cols-2 gap-3 pt-5 sm:grid-cols-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 p-3.5 text-center">
            <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
              Shared Experiences
            </span>
            <span className="text-foreground mt-1 block text-xl font-black">
              {totalExperiences}
            </span>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 p-3.5 text-center">
            <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
              Interview Difficulty
            </span>
            <span className="text-foreground mt-1 block text-xl font-black">
              {avgDifficulty > 0 ? `${avgDifficulty.toFixed(1)}/5` : 'N/A'}
            </span>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 p-3.5 text-center">
            <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
              Questions Logged
            </span>
            <span className="text-foreground mt-1 block text-xl font-black">
              {totalQuestions}
            </span>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 p-3.5 text-center">
            <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
              Reported Offer Rate
            </span>
            <span className="text-primary mt-1 block text-xl font-black">
              {offerRateText}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Experiences Grid */}
      {paginatedExperiences.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={`No experiences yet for ${company.name}`}
          description="Be the first candidate to contribute an interview or assessment debrief for this company!"
          action={
            <Link
              href="/dashboard/experiences/new"
              className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold"
            >
              <Plus className="size-3.5" />
              <span>Share Experience</span>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedExperiences.map((exp, i) => (
            <PublicExperienceCard key={exp.id} experience={exp} index={i} />
          ))}
        </div>
      )}

      {totalExperiences > limit && (
        <div className="flex justify-center pt-4">
          <PaginationWrapper currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
