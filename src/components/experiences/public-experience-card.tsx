"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { StarRating } from "@/components/experiences/star-rating"
import { Calendar, Building, UserCircle } from "lucide-react"
import Link from "next/link"
import { VoteButtons } from "./vote-buttons"

export function PublicExperienceCard({ experience, index }: { experience: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/dashboard/experiences/${encodeURIComponent(experience.company.name)}/${experience.id}`}>
        <Card className="bg-white dark:bg-white/5 backdrop-blur-xl border-border/80 dark:border-white/10 shadow-md dark:shadow-none hover:shadow-xl transition-all flex flex-col h-full cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex gap-4 items-start">
              <div onClick={e => e.preventDefault()} className="flex-shrink-0 pt-0.5">
                <VoteButtons 
                  experienceId={experience.id} 
                  initialUpvotes={experience.upvotes} 
                  initialUserVote={experience.votes?.[0]?.value} 
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {experience.title}
                </CardTitle>
                
                <div className="flex items-center">
                  <StarRating value={experience.difficulty} readonly />
                </div>

                <CardDescription className="flex items-center gap-2 text-sm overflow-hidden whitespace-nowrap">
                  <span className="flex items-center gap-1 font-semibold text-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-md flex-shrink-0">
                    <Building className="size-3.5" />
                    <span className="truncate max-w-[120px]">{experience.company.name}</span>
                  </span>
                  <span className="text-muted-foreground px-2 py-0.5 border border-border/50 rounded-md truncate">
                    {experience.role}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 pb-4">
            <div className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-3 leading-relaxed">
              {experience.content}
            </div>
            
            {experience.tags && experience.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {experience.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                    {tag}
                  </span>
                ))}
                {experience.tags.length > 3 && (
                  <span className="text-xs bg-secondary/50 px-2 py-1 rounded-md text-muted-foreground">
                    +{experience.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-0 pb-4 border-t border-border/40 mt-auto">
            <div className="w-full flex justify-between items-center mt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <UserCircle className="size-4" />
                <span>{experience.isAnonymous ? "Anonymous" : experience.user?.name || "Student"}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  {experience.year}
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
