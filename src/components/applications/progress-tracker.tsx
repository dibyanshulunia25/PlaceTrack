"use client"

import type { ApplicationStatus } from "@prisma/client"
import { Check, X, Minus } from "lucide-react"
import { getStageProgress, CANONICAL_STAGES } from "@/lib/stage-progress"
import { cn } from "@/lib/utils"

interface ProgressTrackerProps {
  status: ApplicationStatus | string
}

export function ProgressTracker({ status }: ProgressTrackerProps) {
  const progress = getStageProgress(status)

  return (
    <div className="w-full py-2">
      <div className="relative flex items-center justify-between">
        {/* Background Track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--bg-elevated)] rounded-full" />

        {/* Active Continuous Track */}
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500",
            progress.colorClass
          )}
          style={{ width: `${progress.percentage}%` }}
        />

        {/* Steps */}
        {CANONICAL_STAGES.map((step, index) => {
          const isCompleted = progress.step > step.step
          const isCurrent = progress.step === step.step
          const isFinal = index === 3

          let nodeColor = "bg-[var(--bg-elevated)] border-2 border-[var(--border-subtle)]"
          let icon = null

          if (isCompleted) {
            nodeColor = "bg-primary border-2 border-primary text-primary-foreground"
            icon = <Check className="size-3" strokeWidth={3} />
          } else if (isCurrent) {
            if (isFinal && progress.isRejected) {
              nodeColor = "bg-red-500 border-2 border-red-500 text-white"
              icon = <X className="size-3" strokeWidth={3} />
            } else if (isFinal && progress.isWithdrawn) {
              nodeColor = "bg-muted-foreground border-2 border-muted-foreground text-background"
              icon = <Minus className="size-3" strokeWidth={3} />
            } else {
              nodeColor =
                "bg-primary border-2 border-primary text-primary-foreground shadow-[0_0_10px_rgba(27,107,80,0.35)] dark:shadow-[0_0_10px_rgba(42,157,143,0.4)]"
              icon = <div className="size-1.5 bg-white rounded-full" />
            }
          }

          const label =
            isFinal && progress.isRejected
              ? "Rejected"
              : isFinal && progress.isWithdrawn
              ? "Withdrawn"
              : step.shortLabel

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "size-5 rounded-full flex items-center justify-center transition-colors duration-300",
                  nodeColor
                )}
              >
                {icon}
              </div>
              <span
                className={cn(
                  "absolute top-6 text-[10px] font-semibold tracking-wide uppercase transition-colors duration-300",
                  isCurrent || isCompleted ? "text-foreground font-bold" : "text-muted-foreground/50",
                  isCurrent && isFinal && progress.isRejected && "text-red-500"
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="h-6" />
    </div>
  )
}
