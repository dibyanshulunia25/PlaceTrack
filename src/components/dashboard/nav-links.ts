import { LayoutDashboard, FileText, Briefcase, Building2, Trophy, Compass, Globe, BrainCircuit } from 'lucide-react'

export const dashboardLinks = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Applications',
    href: '/dashboard/applications',
    icon: FileText,
  },
  {
    title: 'Experiences',
    href: '/dashboard/experiences',
    icon: Briefcase,
  },
  {
    title: 'Mock Interviews',
    href: '/mock-interviews',
    icon: BrainCircuit,
  },
  {
    title: 'Companies',
    href: '/dashboard/companies',
    icon: Building2,
  },
  {
    title: 'Leaderboard',
    href: '/dashboard/leaderboard',
    icon: Trophy,
  },
  {
    title: 'Global Repo',
    href: '/experiences',
    icon: Globe,
  },
  {
    title: 'Discovery Engine',
    href: '/resources',
    icon: Compass,
  },
]
