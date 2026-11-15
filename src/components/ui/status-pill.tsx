import { cn } from "@/lib/utils"

export type ApplicationStatusType =
  | "APPLIED"
  | "ONLINE_ASSESSMENT"
  | "INTERVIEW"
  | "OFFERED"
  | "SELECTED"
  | "REJECTED"
  | "WITHDRAWN"
  | string

interface StatusPillProps {
  status: ApplicationStatusType
  label?: string
  className?: string
  size?: "sm" | "default"
  showDot?: boolean
}

export function StatusPill({
  status,
  label,
  className,
  size = "default",
  showDot = true,
}: StatusPillProps) {
  const normalized = (status || "").toUpperCase().replace(/\s+/g, "_")

  let defaultLabel = label || status
  let pillClass = "pill-status-applied"

  switch (normalized) {
    case "APPLIED":
      defaultLabel = label || "Applied"
      pillClass = "pill-status-applied"
      break
    case "ONLINE_ASSESSMENT":
    case "ASSESSMENT":
      defaultLabel = label || "Assessment"
      pillClass = "pill-status-assessment"
      break
    case "INTERVIEW":
      defaultLabel = label || "Interview"
      pillClass = "pill-status-interview"
      break
    case "OFFERED":
    case "OFFER":
    case "SELECTED":
      defaultLabel = label || (normalized === "SELECTED" ? "Selected" : "Offered")
      pillClass = "pill-status-offer"
      break
    case "REJECTED":
      defaultLabel = label || "Rejected"
      pillClass = "pill-status-rejected"
      break
    case "WITHDRAWN":
      defaultLabel = label || "Withdrawn"
      pillClass = "pill-status-applied opacity-75"
      break
    default:
      defaultLabel = label || status
      pillClass = "pill-status-applied"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-all duration-150 select-none",
        size === "sm"
          ? "px-2 py-0.5 text-[11px] leading-tight"
          : "px-2.5 py-1 text-xs tracking-wide",
        pillClass,
        className
      )}
    >
      {showDot && (
        <span className="size-1.5 rounded-full mr-1.5 opacity-80 bg-current shrink-0" />
      )}
      <span>{defaultLabel}</span>
    </span>
  )
}
