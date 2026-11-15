/**
 * Cleans raw timestamps, numerical IDs, and trailing separator artifacts from resource titles.
 * Examples:
 *   "Google SDE Interview Guide - 17815847792064" -> "Google SDE Interview Guide"
 *   "Top 50 Dynamic Programming Problems (17815847792064)" -> "Top 50 Dynamic Programming Problems"
 *   "System Design Primer _17815847792064" -> "System Design Primer"
 */
export function formatResourceTitle(title: string): string {
  if (!title) return ""
  return title
    // Strip trailing parenthesized IDs: (17815847792064) or [17815847792064]
    .replace(/\s*[\(\[]\s*\d{8,20}\s*[\)\]]$/, "")
    // Strip trailing raw timestamps with leading separators: - 17815847792064, _17815847792064, #17815847792064
    .replace(/[-_#|•:\s]+\b\d{8,20}\b$/, "")
    // Strip any dangling separators at the end
    .replace(/[-–—|•:\s]+$/, "")
    .trim()
}

/**
 * Deduplicates an array of resources by normalized URL and cleaned title.
 */
export function deduplicateResources<T extends { url: string; title: string; company?: string | null }>(
  resources: T[]
): T[] {
  const seen = new Set<string>()
  return resources.filter((r) => {
    const cleanTitle = formatResourceTitle(r.title).toLowerCase()
    const cleanUrl = r.url.replace(/\/$/, "").toLowerCase()
    const key = cleanUrl || `${r.company || ""}:${cleanTitle}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
