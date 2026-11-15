"use client"

import * as React from "react"
import { Application, Company, ApplicationStatus } from "@prisma/client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { StatusPill } from "@/components/ui/status-pill"
import { Building2, Calendar, MapPin, DollarSign, Trash2, Edit3, ArrowRight, Check, X, Clock, ExternalLink } from "lucide-react"
import { updateApplication, deleteApplication } from "@/actions/applications"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ApplicationForm } from "./application-form"
import { cn } from "@/lib/utils"

type ApplicationWithCompany = Application & { company: Company }

interface ApplicationInspectorProps {
  application: ApplicationWithCompany | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STAGES = [
  { id: "APPLIED", label: "Applied", step: 1 },
  { id: "ONLINE_ASSESSMENT", label: "Assessment", step: 2 },
  { id: "INTERVIEW", label: "Technical", step: 3 },
  { id: "HR_ROUND", label: "HR / Fit", step: 4 },
  { id: "OFFERED", label: "Offer", step: 5 },
]

export function ApplicationInspector({ application, open, onOpenChange }: ApplicationInspectorProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  if (!application) return null

  const handleQuickStatusChange = (newStatus: ApplicationStatus) => {
    startTransition(async () => {
      try {
        await updateApplication(application.id, {
          companyName: application.company.name,
          role: application.role,
          status: newStatus,
          appliedAt: new Date(application.appliedAt),
          assessmentDate: newStatus === "ONLINE_ASSESSMENT" && !application.assessmentDate ? new Date() : application.assessmentDate ? new Date(application.assessmentDate) : null,
          interviewDate: (newStatus === "INTERVIEW" || newStatus === "OFFERED") && !application.interviewDate ? new Date() : application.interviewDate ? new Date(application.interviewDate) : null,
          location: application.location,
          salary: application.salary,
        })
      } catch (err) {
        console.error("Failed to update status:", err)
      }
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the ${application.role} application at ${application.company.name}?`)) {
      startTransition(async () => {
        try {
          await deleteApplication(application.id)
          onOpenChange(false)
        } catch (err) {
          console.error("Failed to delete application:", err)
        }
      })
    }
  }

  // Determine current step number
  let currentStep = 1
  if (application.status === "ONLINE_ASSESSMENT") currentStep = 2
  if (application.status === "INTERVIEW") currentStep = 3
  if (application.status === "OFFERED") currentStep = 5

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] p-0 flex flex-col justify-between shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between gap-2 pr-6">
              <StatusPill status={application.status} size="sm" />
              <span className="text-[11px] font-mono text-muted-foreground">
                ID: {application.id.slice(-6)}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight leading-snug">
                {application.role}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Building2 className="size-4 text-primary shrink-0" />
                <span className="font-semibold text-foreground">{application.company.name}</span>
                {application.location && (
                  <>
                    <span>·</span>
                    <span className="truncate">{application.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Inspector Body */}
          <div className="p-6 space-y-6 flex-1">
            {/* 5-Step Stage Progression */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                  Stage Progression
                </span>
                <span className="font-semibold text-primary">Stage {currentStep} of 5</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {STAGES.map((s) => {
                  const isCompleted = s.step < currentStep
                  const isCurrent = s.step === currentStep

                  return (
                    <div key={s.id} className="space-y-1.5 text-center">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          application.status === "REJECTED" && isCurrent
                            ? "bg-red-500"
                            : isCurrent
                            ? "bg-primary ring-2 ring-primary/20"
                            : isCompleted
                            ? "bg-primary/70"
                            : "bg-[var(--bg-elevated)]"
                        )}
                      />
                      <span
                        className={cn(
                          "text-[10px] font-medium block truncate",
                          isCurrent ? "text-foreground font-bold" : "text-muted-foreground"
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Status Update Actions */}
            <div className="space-y-2 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50">
              <span className="text-xs font-bold text-foreground block mb-2">
                Quick Stage Update
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  disabled={isPending || application.status === "APPLIED"}
                  onClick={() => handleQuickStatusChange("APPLIED")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border",
                    application.status === "APPLIED"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-muted-foreground hover:text-foreground"
                  )}
                >
                  Applied
                </button>
                <button
                  disabled={isPending || application.status === "ONLINE_ASSESSMENT"}
                  onClick={() => handleQuickStatusChange("ONLINE_ASSESSMENT")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border",
                    application.status === "ONLINE_ASSESSMENT"
                      ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-muted-foreground hover:text-foreground"
                  )}
                >
                  Assessment
                </button>
                <button
                  disabled={isPending || application.status === "INTERVIEW"}
                  onClick={() => handleQuickStatusChange("INTERVIEW")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border",
                    application.status === "INTERVIEW"
                      ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-muted-foreground hover:text-foreground"
                  )}
                >
                  Interview
                </button>
                <button
                  disabled={isPending || application.status === "OFFERED"}
                  onClick={() => handleQuickStatusChange("OFFERED")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border",
                    application.status === "OFFERED"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-muted-foreground hover:text-foreground"
                  )}
                >
                  Offer 🎉
                </button>
                <button
                  disabled={isPending || application.status === "REJECTED"}
                  onClick={() => handleQuickStatusChange("REJECTED")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border",
                    application.status === "REJECTED"
                      ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-muted-foreground hover:text-foreground"
                  )}
                >
                  Rejected
                </button>
              </div>
            </div>

            {/* Properties List */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider text-[11px] block">
                Application Properties
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    Applied Date
                  </span>
                  <span className="font-semibold text-foreground font-mono">
                    {new Date(application.appliedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {application.assessmentDate && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="size-3.5 text-amber-500" />
                      Assessment Date
                    </span>
                    <span className="font-semibold text-foreground font-mono">
                      {new Date(application.assessmentDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {application.interviewDate && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="size-3.5 text-orange-500" />
                      Interview Date
                    </span>
                    <span className="font-semibold text-foreground font-mono">
                      {new Date(application.interviewDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {application.salary && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <DollarSign className="size-3.5 text-emerald-500" />
                      Compensation / Stipend
                    </span>
                    <span className="font-semibold text-foreground font-mono">
                      {application.salary}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="text-destructive hover:bg-destructive/10 border-destructive/20 text-xs"
            >
              <Trash2 className="size-3.5 mr-1.5" />
              Delete
            </Button>

            <Button
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground font-semibold text-xs"
            >
              <Edit3 className="size-3.5 mr-1.5" />
              Edit Full Details
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Dialog Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>Update details for {application.company.name}.</DialogDescription>
          </DialogHeader>
          <ApplicationForm
            initialData={application}
            onSuccess={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
