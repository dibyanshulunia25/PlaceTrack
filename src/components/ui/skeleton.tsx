import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/10 shadow-clay-sm", className)}
      {...props}
    />
  )
}

export { Skeleton }
