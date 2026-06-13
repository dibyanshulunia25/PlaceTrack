"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, Award, Flame, User, Star } from "lucide-react"

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

export function TopContributors({ contributors }: { contributors: Contributor[] }) {
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Community Expert": return <Trophy className="size-4 text-yellow-500" />
      case "Top Contributor": return <Medal className="size-4 text-purple-500" />
      case "Rising Contributor": return <Flame className="size-4 text-orange-500" />
      default: return <Star className="size-4 text-blue-500" />
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Community Expert": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Top Contributor": return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "Rising Contributor": return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  return (
    <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-clay-md p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl shadow-inner">
          <Award className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Top Contributors</h2>
          <p className="text-sm text-muted-foreground">Ranked by overall contribution score</p>
        </div>
      </div>

      <div className="space-y-4">
        {contributors.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/10 shadow-sm hover:shadow-clay-sm transition-all"
          >
            <div className={`flex items-center justify-center w-8 font-black text-xl ${index < 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              #{index + 1}
            </div>
            
            <div className="size-12 rounded-full bg-white/50 dark:bg-black/50 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="size-6 text-primary/50" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{user.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${getBadgeColor(user.badge)}`}>
                  {getBadgeIcon(user.badge)}
                  {user.badge}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  • {user.totalExperiences} Exp
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  • {user.totalUpvotes} Votes
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-primary">{user.score}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Score</div>
            </div>
          </motion.div>
        ))}

        {contributors.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No contributors found for this timeframe.
          </div>
        )}
      </div>
    </div>
  )
}
