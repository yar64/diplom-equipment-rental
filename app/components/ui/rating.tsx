// components/ui/rating.tsx
'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  max?: number
}

const Rating = ({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  showValue = false,
  max = 5
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState(0)
  
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }
  
  const handleClick = (newValue: number) => {
    if (!readOnly && onChange) {
      onChange(newValue)
    }
  }
  
  const displayValue = hoverValue || value
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(max)].map((_, index) => {
          const starValue = index + 1
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => !readOnly && setHoverValue(starValue)}
              onMouseLeave={() => !readOnly && setHoverValue(0)}
              disabled={readOnly}
              className={`
                ${readOnly ? 'cursor-default' : 'cursor-pointer'}
                transition-transform hover:scale-110
              `}
            >
              <Star
                className={`
                  ${sizes[size]}
                  ${starValue <= displayValue
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                  }
                `}
              />
            </button>
          )
        })}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-gray-700">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// Специализированный рейтинг с отзывами для оборудования
const EquipmentRating = ({
  rating,
  reviewCount,
  size = 'md'
}: {
  rating: number
  reviewCount: number
  size?: 'sm' | 'md' | 'lg'
}) => {
  return (
    <div className="flex items-center gap-3">
      <Rating value={rating} readOnly size={size} showValue />
      {reviewCount > 0 && (
        <span className="text-sm text-gray-500">
          ({reviewCount} {reviewCount === 1 ? 'отзыв' : reviewCount < 5 ? 'отзыва' : 'отзывов'})
        </span>
      )}
    </div>
  )
}

export { Rating, EquipmentRating }