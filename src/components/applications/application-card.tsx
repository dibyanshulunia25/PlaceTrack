"use client"

import * as React from "react"
import { format } from "date-fns"
import { MoreHorizontal, Calendar, MapPin, DollarSign, Trash, Edit, ArrowUpRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { deleteApplication } from "@/actions/applications"
import { ApplicationForm } from "./application-form"
import { StatusPill } from "@/components/ui/status-pill"
import { getStageProgress } from "@/lib/stage-progress"
import { cn } from "@/lib/utils"

interface ApplicationCardProps {
  application: any
  onInspect?: () => void
}

export function ApplicationCard({ application, onInspect }: ApplicationCardProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const progress = getStageProgress(application.status)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (
      window.confirm(
        `Are you sure you want to delete the ${application.role} application at ${application.company.name}?`
      )
    ) {
      startTransition(() => {
        deleteApplication(application.id)
      })
    }
  }

  // Format target milestone or applied date
  let targetDateText = "No date"
  if (application.interviewDate) {
    targetDateText = `Int: ${format(new Date(application.interviewDate), "MMM d, yyyy")}`
  } else if (application.assessmentDate) {
    targetDateText = `OA: ${format(new Date(application.assessmentDate), "MMM d, yyyy")}`
  } else if (application.appliedAt) {
    targetDateText = `Applied: ${format(new Date(application.appliedAt), "MMM d, yyyy")}`
  }

  return (
    <>
      <div
        onClick={onInspect}
        className="h-full min-h-[216px] flex flex-col justify-between p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-primary/40 transition-all shadow-[var(--shadow-elevation-card)] group select-none cursor-pointer"
      >
        {/* Top Zone: Company Monogram + Company Name (line-clamp-1) + Role Title (line-clamp-1) + Status Pill (shrink-0) */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Monogram */}
              <div className="size-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-sm text-foreground shrink-0 group-hover:border-primary/40 group-hover:text-primary transition-colors">
                {application.company.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-xs text-muted-foreground line-clamp-1 leading-tight">
                  {application.company.name}
                </span>
                <h4
                  className="font-bold text-base text-foreground line-clamp-1 leading-snug group-hover:text-primary transition-colors mt-0.5"
                  title={application.role}
                >
                  {application.role}
                </h4>
              </div>
            </div>

            {/* Non-shrinking Status Pill & More Menu */}
            <div className="shrink-0 flex items-center gap-1.5">
              <StatusPill status={application.status} size="sm" />

              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={(e) => e.stopPropagation()}
                  className="size-7 rounded-lg inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)] transition-colors"
                  aria-label="More options"
                >
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditOpen(true)
                    }}
                    className="cursor-pointer"
                  >
                    <Edit className="size-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isPending}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash className="size-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Middle Zone: The exact getStageProgress continuous progress track + 4 aligned stage labels */}
        <div className="my-3 py-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground mb-1.5">
            <span className={cn(progress.step >= 1 && "text-foreground font-bold")}>Applied</span>
            <span className={cn(progress.step >= 2 && "text-foreground font-bold")}>OA</span>
            <span className={cn(progress.step >= 3 && "text-foreground font-bold")}>Interview</span>
            <span
              className={cn(
                progress.isOffer && "text-emerald-600 dark:text-emerald-400 font-bold",
                progress.isRejected && "text-red-500 font-bold"
              )}
            >
              {progress.isRejected ? "Rejected" : progress.isWithdrawn ? "Withdrawn" : "Offer"}
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-300", progress.colorClass)}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Bottom Zone: Pinned footer showing CTC/Stipend, Target Date, and quick-inspect trigger */}
        <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3 min-w-0">
            {application.salary ? (
              <span className="font-mono text-[11px] font-semibold text-foreground/80 truncate">
                {application.salary}
              </span>
            ) : application.location ? (
              <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{application.location}</span>
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground/60 italic">Standard</span>
            )}

            <span className="font-mono text-[11px] flex items-center gap-1 shrink-0">
              <Calendar className="size-3 text-muted-foreground shrink-0" />
              {targetDateText}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform shrink-0">
            <span>Inspect</span>
            <ArrowUpRight className="size-3" />
          </span>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>Update the details of your application here.</DialogDescription>
          </DialogHeader>
          <ApplicationForm initialData={application} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
