import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function NewExperienceButton() {
  return (
    <Button className="bg-primary hover:opacity-90 transition-opacity" asChild>
      <Link href="/dashboard/experiences/new">
        <div className="flex justify-center items-center">

        <Plus className="mr-2 h-4 w-4" />
        Add Experience
        </div>
      </Link>
    </Button>
  )
}
