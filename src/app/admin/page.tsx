"use client"

import { useEffect, useState } from "react"
import { getAdminStats } from "@/actions/admin"
import { motion } from "framer-motion"
import { Users, Building2, Briefcase, Star, Vote, TrendingUp } from "lucide-react"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats().then(data => {
      setStats(data)
      setLoading(false)
    }).catch(console.error)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const overviewCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Companies", value: stats.totalCompanies, icon: Building2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Total Applications", value: stats.totalApplications, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Total Experiences", value: stats.totalExperiences, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Total Votes", value: stats.totalVotes, icon: Vote, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "New Registrations (24h)", value: stats.newRegistrations, icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Overview</h1>
        <p className="text-slate-500">Welcome to the PlaceTrack Admin Portal.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {overviewCards.map((card, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${card.bg}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Most Active Companies */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-sm"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-500" />
            Most Active Companies
          </h3>
          <div className="space-y-4">
            {stats.topCompanies.map((company: any) => (
              <div key={company.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                <span className="font-medium">{company.name}</span>
                <div className="text-sm text-slate-500 flex gap-4">
                  <span>{company._count.experiences} Exp</span>
                  <span>{company._count.applications} Apps</span>
                </div>
              </div>
            ))}
            {stats.topCompanies.length === 0 && (
              <p className="text-sm text-slate-500 italic">No companies yet.</p>
            )}
          </div>
        </motion.div>

        {/* Most Viewed Experiences */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-sm"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Most Viewed Experiences
          </h3>
          <div className="space-y-4">
            {stats.topExperiences.map((exp: any) => (
              <div key={exp.id} className="flex flex-col gap-1 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                <div className="flex justify-between">
                  <span className="font-medium line-clamp-1">{exp.title}</span>
                  <span className="text-sm font-semibold text-amber-500">{exp.views} views</span>
                </div>
                <div className="text-xs text-slate-500">
                  {exp.company.name} • By {exp.isAnonymous ? "Anonymous" : exp.user?.name || "Unknown"}
                </div>
              </div>
            ))}
            {stats.topExperiences.length === 0 && (
              <p className="text-sm text-slate-500 italic">No experiences yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
