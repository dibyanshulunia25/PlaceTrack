"use client"

import type { ApplicationStatus } from "@prisma/client"
import { Check, X, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressTrackerProps {
  status: ApplicationStatus
}

export function ProgressTracker({ status }: ProgressTrackerProps) {
  const getStepLevel = (s: ApplicationStatus) => {
    switch (s) {
      case "APPLIED": return 0
      case "ONLINE_ASSESSMENT": return 1
      case "INTERVIEW": return 2
      case "OFFERED": 
      case "REJECTED": 
      case "WITHDRAWN": return 3
      default: return 0
    }
  }

  const currentLevel = getStepLevel(status)

  const steps = [
    { level: 0, label: "Applied" },
    { level: 1, label: "Assessment" },
    { level: 2, label: "Interview" },
    { level: 3, label: status === "REJECTED" ? "Rejected" : status === "WITHDRAWN" ? "Withdrawn" : "Offered" }
  ]

  return (
    <div className="w-full py-2">
      <div className="relative flex items-center justify-between">
        {/* Background Track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary rounded-full" />
        
        {/* Active Track */}
        <div 
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500",
            status === "REJECTED" ? "bg-destructive" : status === "WITHDRAWN" ? "bg-muted-foreground" : "bg-primary"
          )}
          style={{ width: `${(currentLevel / 3) * 100}%` }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = currentLevel > step.level
          const isCurrent = currentLevel === step.level
          const isFinal = index === 3

          let nodeColor = "bg-secondary border-2 border-secondary"
          let icon = null

          if (isCompleted) {
            nodeColor = "bg-primary border-2 border-primary text-primary-foreground"
            icon = <Check className="size-3" strokeWidth={3} />
          } else if (isCurrent) {
            if (isFinal && status === "REJECTED") {
              nodeColor = "bg-destructive border-2 border-destructive text-destructive-foreground"
              icon = <X className="size-3" strokeWidth={3} />
            } else if (isFinal && status === "WITHDRAWN") {
              nodeColor = "bg-muted-foreground border-2 border-muted-foreground text-background"
              icon = <Minus className="size-3" strokeWidth={3} />
            } else {
              nodeColor = "bg-primary border-2 border-primary text-primary-foreground shadow-[0_0_10px_rgba(0,198,255,0.5)]"
              icon = <div className="size-1.5 bg-white rounded-full" />
            }
          } else {
            nodeColor = "bg-surface border-2 border-secondary dark:bg-card"
          }

          return (
            <div key={step.level} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "size-5 rounded-full flex items-center justify-center transition-colors duration-300", 
                  nodeColor
                )}
              >
                {icon}
              </div>
              {/* Tooltip or Label - visible only on desktop or kept tiny */}
              <span 
                className={cn(
                  "absolute top-6 text-[10px] font-semibold tracking-wide uppercase transition-colors duration-300",
                  isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground/50",
                  isCurrent && isFinal && status === "REJECTED" && "text-destructive"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="h-6" /> {/* Spacer for the absolute labels */}
    </div>
  )
}
