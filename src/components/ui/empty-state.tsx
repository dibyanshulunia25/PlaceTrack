import React from "react"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white/5 dark:bg-black/5 backdrop-blur-md rounded-2xl border border-white/10 dark:border-white/5 shadow-clay-sm">
      <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-full shadow-inner mb-6">
        <Icon className="h-10 w-10 text-primary opacity-80" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
}
