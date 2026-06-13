import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export function NewExperienceButton() {
  return (
    <Link 
      href="/dashboard/experiences/new"
      className={buttonVariants({ className: "bg-primary hover:opacity-90 transition-opacity" })}
    >
      <div className="flex justify-center items-center">
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </div>
    </Link>
  )
}
