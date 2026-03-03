// components/ui/pagination.tsx
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = ''
}: PaginationProps) => {
  
  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
  }
  
  const paginationRange = () => {
    const totalNumbers = siblingCount * 2 + 3
    const totalBlocks = totalNumbers + 2
    
    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount)
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount)
      
      let pages: (number | string)[] = range(startPage, endPage)
      
      const hasLeftSpill = startPage > 2
      const hasRightSpill = (totalPages - endPage) > 1
      const spillOffset = totalNumbers - (pages.length + 1)
      
      switch (true) {
        case hasLeftSpill && !hasRightSpill:
          const extraPages = range(startPage - spillOffset, startPage - 1)
          pages = ['...', ...extraPages, ...pages]
          break
        case !hasLeftSpill && hasRightSpill:
          const extraPages = range(endPage + 1, endPage + spillOffset)
          pages = [...pages, ...extraPages, '...']
          break
        case hasLeftSpill && hasRightSpill:
          pages = ['...', ...pages, '...']
          break
      }
      
      return [1, ...pages, totalPages]
    }
    
    return range(1, totalPages)
  }
  
  const pages = paginationRange()
  
  if (totalPages <= 1) return null
  
  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 disabled:opacity-30 hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="flex h-8 w-8 items-center justify-center">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </span>
          )
        }
        
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`
              flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium
              ${currentPage === page 
                ? 'border border-black bg-black text-white' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {page}
          </button>
        )
      })}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 disabled:opacity-30 hover:bg-gray-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

// Специализированная пагинация для каталога с показом элементов
const CatalogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 12,
  totalItems = 0
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
}) => {
  
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Показано {startItem}-{endItem} из {totalItems} позиций
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export { Pagination, CatalogPagination }