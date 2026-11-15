export interface DifficultyBadgeInfo {
  label: "Easy" | "Medium" | "Hard" | "Unrated"
  score: string
  colorClass: string
}

export function getDifficultyBadge(avgDifficulty: number | null | undefined): DifficultyBadgeInfo {
  if (avgDifficulty === null || avgDifficulty === undefined || avgDifficulty <= 0) {
    return {
      label: "Unrated",
      score: "N/A",
      colorClass: "bg-[var(--bg-elevated)] text-muted-foreground border-[var(--border-subtle)]",
    }
  }

  if (avgDifficulty <= 2.3) {
    return {
      label: "Easy",
      score: `${avgDifficulty.toFixed(1)}/5`,
      colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    }
  }

  if (avgDifficulty <= 3.7) {
    return {
      label: "Medium",
      score: `${avgDifficulty.toFixed(1)}/5`,
      colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    }
  }

  return {
    label: "Hard",
    score: `${avgDifficulty.toFixed(1)}/5`,
    colorClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  }
}
