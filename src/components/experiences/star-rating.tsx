"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function StarRating({ value, onChange, readonly = false }: { value: number, onChange?: (val: number) => void, readonly?: boolean }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-6 cursor-pointer transition-colors",
            (hover || value) >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
            readonly && "cursor-default"
          )}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        />
      ))}
    </div>
  )
}
