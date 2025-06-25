import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

interface SearchPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

interface PaginationNumbersProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function PaginationNumbers({ currentPage, totalPages, onPageChange }: PaginationNumbersProps) {
  const getMiddlePageNumbers = () => {
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)
    
    // Adjust range if we're near the beginning or end
    if (currentPage <= 3) {
      end = Math.min(totalPages - 1, 4)
    }
    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - 3)
    }
    
    const pages = []
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }
    return pages
  }

  const middlePages = getMiddlePageNumbers()

  return (
    <>
      {middlePages.map((pageNum) => (
        <PaginationItem key={pageNum}>
          <PaginationLink
            href="#"
            isActive={currentPage === pageNum}
            onClick={(e) => {
              e.preventDefault()
              onPageChange(pageNum)
            }}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
      ))}
    </>
  )
}

export function SearchPagination({ currentPage, totalPages, onPageChange }: SearchPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous button */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage - 1)
              }}
            />
          </PaginationItem>
        )}
        
        {/* First page */}
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault()
              onPageChange(1)
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
        
        {/* Left ellipsis */}
        {currentPage > 4 && totalPages > 6 && (
          <PaginationItem>
            <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
              ...
            </span>
          </PaginationItem>
        )}
        
        {/* Middle page numbers */}
        <PaginationNumbers 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
        
        {/* Right ellipsis */}
        {currentPage < totalPages - 3 && totalPages > 6 && (
          <PaginationItem>
            <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
              ...
            </span>
          </PaginationItem>
        )}
        
        {/* Last page */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(totalPages)
              }}
              className={totalPages > 99 ? "px-2 min-w-[2.5rem]" : ""}
            >
              {totalPages > 999 ? "Last" : totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {/* Next button */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage + 1)
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
} 