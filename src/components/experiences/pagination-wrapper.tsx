"use client"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

export function PaginationWrapper({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-4 mt-8 pb-12">
      <Button 
        variant="outline" 
        disabled={currentPage <= 1} 
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
      <Button 
        variant="outline" 
        disabled={currentPage >= totalPages} 
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  )
}
