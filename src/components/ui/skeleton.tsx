import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md bg-[var(--bg-elevated)] animate-shimmer relative overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
