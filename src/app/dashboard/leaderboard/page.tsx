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

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
    <div className="animate-in fade-in container mx-auto max-w-7xl space-y-8 px-4 py-8 duration-500 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center space-y-4 text-center">
        <div className="shadow-clay-inset mb-2 rounded-full bg-yellow-500/10 p-4">
          <Trophy className="size-12 text-yellow-500" />
        </div>
        <h1 className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
          Community Leaderboard
        </h1>
        <p className="text-muted-foreground max-w-2xl text-xl">
          Celebrating the most active and helpful members of our community.
        </p>

        {/* Timeframe Filters */}
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-1 shadow-inner backdrop-blur-md dark:bg-black/20">
          <Link
            href="/dashboard/leaderboard?timeframe=weekly"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${timeframe === 'weekly' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            Weekly
          </Link>
          <Link
            href="/dashboard/leaderboard?timeframe=monthly"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${timeframe === 'monthly' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            Monthly
          </Link>
          <Link
            href="/dashboard/leaderboard?timeframe=all-time"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${timeframe === 'all-time' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            All-Time
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Column: Top Contributors */}
        <div className="lg:col-span-7 xl:col-span-8">
          <TopContributors contributors={contributors} />
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
