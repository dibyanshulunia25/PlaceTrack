export interface StageProgress {
  step: number
  totalSteps: number
  percentage: number
  label: string
  isOffer: boolean
  isRejected: boolean
  isWithdrawn: boolean
  isClosed: boolean
  colorClass: string
}

export const CANONICAL_STAGES = [
  { step: 1, label: "Applied", shortLabel: "Applied", key: "APPLIED" },
  { step: 2, label: "Assessment / OA", shortLabel: "OA", key: "ONLINE_ASSESSMENT" },
  { step: 3, label: "Interview", shortLabel: "Interview", key: "INTERVIEW" },
  { step: 4, label: "Selected / Offer", shortLabel: "Offer", key: "OFFERED" },
] as const

/**
 * Normalizes case/whitespace and computes exact stage progress metrics:
 * - Applied -> Step 1 of 4 (25% bar fill)
 * - Assessment / OA -> Step 2 of 4 (50% bar fill)
 * - Interview -> Step 3 of 4 (75% bar fill)
 * - Selected / Offer -> Step 4 of 4 (100% bar fill in Emerald / Teal)
 * - Rejected -> 100% muted red fill, marked closed
 * - Withdrawn -> 100% muted slate fill, marked closed
 */
export function getStageProgress(status?: string | null): StageProgress {
  if (!status) {
    return {
      step: 1,
      totalSteps: 4,
      percentage: 25,
      label: "Applied",
      isOffer: false,
      isRejected: false,
      isWithdrawn: false,
      isClosed: false,
      colorClass: "bg-primary",
    }
  }

  const s = status.toLowerCase().replace(/[\s_\-]+/g, "")

  if (s.includes("reject")) {
    return {
      step: 4,
      totalSteps: 4,
      percentage: 100,
      label: "Rejected",
      isOffer: false,
      isRejected: true,
      isWithdrawn: false,
      isClosed: true,
      colorClass: "bg-red-500/80 dark:bg-red-500/90",
    }
  }

  if (s.includes("withdraw")) {
    return {
      step: 4,
      totalSteps: 4,
      percentage: 100,
      label: "Withdrawn",
      isOffer: false,
      isRejected: false,
      isWithdrawn: true,
      isClosed: true,
      colorClass: "bg-muted-foreground/60",
    }
  }

  if (
    s.includes("offer") ||
    s.includes("select") ||
    s.includes("hired") ||
    s.includes("accept")
  ) {
    return {
      step: 4,
      totalSteps: 4,
      percentage: 100,
      label: "Selected / Offer",
      isOffer: true,
      isRejected: false,
      isWithdrawn: false,
      isClosed: false,
      colorClass: "bg-[var(--accent-primary)]",
    }
  }

  if (
    s.includes("interview") ||
    s.includes("tech") ||
    s.includes("round") ||
    s.includes("hr")
  ) {
    return {
      step: 3,
      totalSteps: 4,
      percentage: 75,
      label: "Interview",
      isOffer: false,
      isRejected: false,
      isWithdrawn: false,
      isClosed: false,
      colorClass: "bg-primary",
    }
  }

  if (
    s.includes("assessment") ||
    s.includes("oa") ||
    s.includes("test") ||
    s.includes("online")
  ) {
    return {
      step: 2,
      totalSteps: 4,
      percentage: 50,
      label: "Assessment / OA",
      isOffer: false,
      isRejected: false,
      isWithdrawn: false,
      isClosed: false,
      colorClass: "bg-primary",
    }
  }

  return {
    step: 1,
    totalSteps: 4,
    percentage: 25,
    label: "Applied",
    isOffer: false,
    isRejected: false,
    isWithdrawn: false,
    isClosed: false,
    colorClass: "bg-primary",
  }
}
