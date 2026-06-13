import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { StarRating } from "./star-rating"
import { Calendar, Building, UserCircle } from "lucide-react"

export function ExperienceCard({ experience }: { experience: any }) {
  return (
    <Card className="bg-white dark:bg-white/5 backdrop-blur-xl border-border/80 dark:border-white/10 shadow-md dark:shadow-none hover:shadow-lg dark:hover:shadow-none transition-all flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl leading-tight">{experience.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm flex-wrap mt-1">
              <span className="flex items-center gap-1 font-semibold text-foreground bg-secondary px-2 py-0.5 rounded-md">
                <Building className="size-3.5" />
                {experience.company.name}
              </span>
              <span className="text-muted-foreground px-2 py-0.5">{experience.role}</span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Difficulty</span>
            <StarRating value={experience.difficulty} readonly />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-6 leading-relaxed">
          {experience.content}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 border-t border-border/40 mt-auto">
        <div className="w-full flex justify-between items-center mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <UserCircle className="size-4" />
            <span>{experience.isAnonymous ? "Anonymous" : experience.user.name || "Student"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Calendar className="size-4" />
            <span>{experience.year}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
