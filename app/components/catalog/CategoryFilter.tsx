// components/CategoryFilter.tsx
"use client"

import { LucideIcon } from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: LucideIcon
  count: number
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (id: string) => void
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-4">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = selectedCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`group relative flex-shrink-0 flex flex-col items-center p-4 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              <div className={`mb-2 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-background group-hover:bg-background/80'
              }`}>
                <Icon className={`w-6 h-6 ${
                  isActive ? 'text-primary-foreground' : 'text-primary'
                }`} />
              </div>
              <span className={`font-medium text-sm mb-1 ${
                isActive ? 'text-primary-foreground' : 'text-foreground'
              }`}>
                {category.name}
              </span>
              <span className={`text-xs ${
                isActive 
                  ? 'text-primary-foreground/80' 
                  : 'text-muted-foreground'
              }`}>
                {category.count} позиций
              </span>
              
              {/* Индикатор активности */}
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-ping-slow" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}