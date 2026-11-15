import {
  getMostActiveCompanies,
  getMostHelpfulExperiences,
  getPopularTopics,
  getTopContributors,
  Timeframe,
} from '@/actions/leaderboard';
import { TopContributors } from '@/components/leaderboard/top-contributors';
import { HelpfulExperiences } from '@/components/leaderboard/helpful-experiences';
import { TrendingGrid } from '@/components/leaderboard/trending-grid';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page-header';
import { currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await currentUser();
  const params = await searchParams;

  const tfParam =
    typeof params.timeframe === 'string' ? params.timeframe : 'all-time';
  const timeframe: Timeframe =
    tfParam === 'weekly' || tfParam === 'monthly' ? tfParam : 'all-time';

  const [contributors, experiences, companies, topics] = await Promise.all([
    getTopContributors(timeframe),
    getMostHelpfulExperiences(timeframe),
    getMostActiveCompanies(timeframe),
    getPopularTopics(timeframe),
  ]);

  return (
    <div className="animate-in fade-in container mx-auto max-w-7xl space-y-6 duration-500">
      <PageHeader
        title="Community Leaderboard"
        subtitle="Celebrating the most active contributors, helpful questions, and peer reviews."
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 text-[var(--accent-copper)]">
            Top Contributors
          </span>
        }
        actions={
          <div className="flex items-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-1 text-xs">
            <Link
              href="/dashboard/leaderboard?timeframe=weekly"
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${timeframe === 'weekly' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Weekly
            </Link>
            <Link
              href="/dashboard/leaderboard?timeframe=monthly"
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${timeframe === 'monthly' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Monthly
            </Link>
            <Link
              href="/dashboard/leaderboard?timeframe=all-time"
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${timeframe === 'all-time' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All-Time
            </Link>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Column: Top Contributors */}
        <div className="lg:col-span-7 xl:col-span-8">
          <TopContributors contributors={contributors} currentUserId={user?.id} />
        </div>

        {/* Sidebar: Experiences & Trending */}
        <div className="space-y-8 lg:col-span-5 xl:col-span-4">
          <HelpfulExperiences experiences={experiences} />
          <TrendingGrid companies={companies} topics={topics} />
        </div>
      </div>
    </div>
  );
}
