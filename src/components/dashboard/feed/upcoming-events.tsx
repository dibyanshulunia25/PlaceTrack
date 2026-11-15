import { Application, Company } from "@prisma/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import { StatusPill } from "@/components/ui/status-pill"

type AppWithCompany = Application & { company: Company }

export function UpcomingEvents({ applications }: { applications: AppWithCompany[] }) {
  const upcoming = applications
    .filter(app => {
      if (app.status === 'ONLINE_ASSESSMENT' && app.assessmentDate && new Date(app.assessmentDate) > new Date()) return true;
      if (app.status === 'INTERVIEW' && app.interviewDate && new Date(app.interviewDate) > new Date()) return true;
      return false;
    })
    .sort((a, b) => {
      const dateA = a.status === 'ONLINE_ASSESSMENT' ? new Date(a.assessmentDate!) : new Date(a.interviewDate!)
      const dateB = b.status === 'ONLINE_ASSESSMENT' ? new Date(b.assessmentDate!) : new Date(b.interviewDate!)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, 3)

  if (upcoming.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Calendar className="size-5 text-primary" /> Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-6 bg-secondary/30 rounded-xl">No upcoming assessments or interviews scheduled.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calendar className="size-5 text-primary" /> Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcoming.map(app => {
          const date = app.status === 'ONLINE_ASSESSMENT' ? new Date(app.assessmentDate!) : new Date(app.interviewDate!)
          const isSoon = date.getTime() - new Date().getTime() < 86400000 * 2 // 2 days

          return (
            <div key={app.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] transition-colors hover:bg-[var(--bg-elevated)]">
              <div className={`mt-0.5 rounded-full p-2 flex-shrink-0 ${isSoon ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                {isSoon ? <AlertCircle className="size-4" /> : <Clock className="size-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm leading-tight truncate">{app.role} at {app.company.name}</p>
                </div>
                <div className="mt-1">
                  <StatusPill status={app.status} size="sm" />
                </div>
                <p className={`text-xs font-bold mt-1.5 ${isSoon ? 'text-red-500' : 'text-primary'}`}>
                  {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
