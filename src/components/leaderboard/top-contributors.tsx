"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, Award, Flame, Star, Crown, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Contributor {
  id: string
  name: string
  image: string | null
  score: number
  totalExperiences: number
  totalQuestions: number
  totalUpvotes: number
  badge: string
}

interface TopContributorsProps {
  contributors: Contributor[]
  currentUserId?: string | null
}

export function TopContributors({ contributors, currentUserId }: TopContributorsProps) {
  const top1 = contributors[0]
  const top2 = contributors[1]
  const top3 = contributors[2]
  const rest = contributors.slice(3)

  return (
    <div className="space-y-6">
      {/* 1. Top 3 Contributors Podium Strip */}
      {contributors.length >= 3 && (
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevation-card)]">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-[var(--accent-copper)]" />
              <h3 className="text-base font-bold text-foreground">Hall of Fame — Top 3 Cohort</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-copper)]/10 text-[var(--accent-copper)] border border-[var(--accent-copper)]/20">
              Community Champions
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 items-end pt-4 pb-2 max-w-xl mx-auto text-center">
            {/* Rank 2 (Silver) - Left */}
            {top2 && (
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="size-14 rounded-full border-2 border-slate-300 dark:border-slate-500 overflow-hidden bg-[var(--bg-elevated)] flex items-center justify-center shadow-xs">
                    {top2.image ? (
                      <img src={top2.image} alt={top2.name} className="size-full object-cover" />
                    ) : (
                      <User className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-400 text-slate-800 dark:text-slate-200 font-black text-[10px] flex items-center justify-center shadow-2xs">
                    2
                  </span>
                </div>
                <p className="text-xs font-bold text-foreground truncate max-w-[100px]">{top2.name}</p>
                <span className="text-[11px] font-mono font-black text-foreground mt-0.5">{top2.score} pts</span>
                <div className="w-full h-16 rounded-t-xl bg-slate-200/50 dark:bg-slate-800/60 border-t-2 border-slate-300 dark:border-slate-600 mt-2 flex items-center justify-center">
                  <Medal className="size-5 text-slate-400" />
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) - Center Elevated */}
            {top1 && (
              <div className="flex flex-col items-center">
                <Crown className="size-6 text-amber-500 mb-1 animate-bounce" />
                <div className="relative mb-2">
                  <div className="size-16 rounded-full border-2 border-amber-400 dark:border-amber-500 overflow-hidden bg-[var(--bg-elevated)] flex items-center justify-center shadow-md ring-4 ring-amber-400/20">
                    {top1.image ? (
                      <img src={top1.image} alt={top1.name} className="size-full object-cover" />
                    ) : (
                      <User className="size-7 text-muted-foreground" />
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 size-6 rounded-full bg-amber-400 border border-amber-600 text-amber-950 font-black text-xs flex items-center justify-center shadow-2xs">
                    1
                  </span>
                </div>
                <p className="text-xs font-black text-foreground truncate max-w-[120px]">{top1.name}</p>
                <span className="text-xs font-mono font-black text-primary mt-0.5">{top1.score} pts</span>
                <div className="w-full h-24 rounded-t-xl bg-amber-500/10 dark:bg-amber-500/15 border-t-2 border-amber-400 mt-2 flex items-center justify-center">
                  <Trophy className="size-6 text-amber-500" />
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) - Right */}
            {top3 && (
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="size-14 rounded-full border-2 border-[var(--accent-copper)]/70 overflow-hidden bg-[var(--bg-elevated)] flex items-center justify-center shadow-xs">
                    {top3.image ? (
                      <img src={top3.image} alt={top3.name} className="size-full object-cover" />
                    ) : (
                      <User className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[var(--accent-copper)] border border-amber-800 text-white font-black text-[10px] flex items-center justify-center shadow-2xs">
                    3
                  </span>
                </div>
                <p className="text-xs font-bold text-foreground truncate max-w-[100px]">{top3.name}</p>
                <span className="text-[11px] font-mono font-black text-foreground mt-0.5">{top3.score} pts</span>
                <div className="w-full h-12 rounded-t-xl bg-amber-800/10 dark:bg-amber-700/20 border-t-2 border-[var(--accent-copper)] mt-2 flex items-center justify-center">
                  <Medal className="size-5 text-[var(--accent-copper)]" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. High-Contrast Ranking Table */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevation-card)] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground leading-tight">All Ranked Contributors</h3>
            <p className="text-xs text-muted-foreground">Calculated from verified experiences, questions & peer upvotes</p>
          </div>
          <span className="text-xs text-muted-foreground">{contributors.length} Members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Contributor</th>
                <th className="py-3 px-4 hidden sm:table-cell">Badge</th>
                <th className="py-3 px-3 text-center hidden md:table-cell">Experiences</th>
                <th className="py-3 px-3 text-center hidden md:table-cell">Questions</th>
                <th className="py-3 px-3 text-center hidden sm:table-cell">Upvotes</th>
                <th className="py-3 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {contributors.map((user, idx) => {
                const rank = idx + 1
                const isCurrentUser = currentUserId === user.id

                return (
                  <tr
                    key={user.id}
                    className={cn(
                      "transition-colors",
                      isCurrentUser
                        ? "bg-primary/10 font-bold border-l-4 border-l-primary"
                        : "hover:bg-[var(--bg-elevated)]/50"
                    )}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-muted-foreground">
                      {rank <= 3 ? (
                        <span
                          className={cn(
                            "inline-flex size-6 items-center justify-center rounded-full text-xs font-black",
                            rank === 1 && "bg-amber-400 text-amber-950",
                            rank === 2 && "bg-slate-300 text-slate-900 dark:bg-slate-700 dark:text-slate-200",
                            rank === 3 && "bg-[var(--accent-copper)] text-white"
                          )}
                        >
                          {rank}
                        </span>
                      ) : (
                        `#${rank}`
                      )}
                    </td>

                    {/* Contributor Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden shrink-0 flex items-center justify-center">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="size-full object-cover" />
                          ) : (
                            <User className="size-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[140px] sm:max-w-xs">
                            {user.name}
                          </p>
                          {isCurrentUser && (
                            <span className="text-[10px] text-primary font-bold">That's you!</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-foreground">
                        {user.badge}
                      </span>
                    </td>

                    {/* Experiences */}
                    <td className="py-3 px-3 text-center hidden md:table-cell font-mono">
                      {user.totalExperiences}
                    </td>

                    {/* Questions */}
                    <td className="py-3 px-3 text-center hidden md:table-cell font-mono">
                      {user.totalQuestions}
                    </td>

                    {/* Upvotes */}
                    <td className="py-3 px-3 text-center hidden sm:table-cell font-mono text-[var(--accent-copper)] font-semibold">
                      +{user.totalUpvotes}
                    </td>

                    {/* Score */}
                    <td className="py-3 px-4 text-right font-mono font-black text-sm text-primary">
                      {user.score}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
