// components/ui/skeleton.tsx

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rectangle' | 'card'
  width?: string
  height?: string
}

const Skeleton = ({ 
  className = '', 
  variant = 'text',
  width,
  height 
}: SkeletonProps) => {
  
  const variants = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
    card: 'rounded-lg h-48',
  }
  
  return (
    <div
      className={`
        animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        ${variants[variant]}
        ${width ? `w-${width}` : ''}
        ${height ? `h-${height}` : ''}
        ${className}
      `}
    />
  )
}

// Специализированные скелетоны для оборудования
const EquipmentCardSkeleton = () => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
    <Skeleton variant="card" className="w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="w-3/4 h-6" />
      <div className="flex gap-2">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-24 h-10" />
      </div>
    </div>
  </div>
)

const CatalogGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <EquipmentCardSkeleton key={i} />
    ))}
  </div>
)

export { Skeleton, EquipmentCardSkeleton, CatalogGridSkeleton }