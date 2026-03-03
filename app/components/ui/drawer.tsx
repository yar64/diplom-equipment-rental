// components/ui/drawer.tsx
'use client'

import { useEffect } from 'react'
import { X, Filter, Menu, ShoppingCart } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  position?: 'left' | 'right'
  title?: string
  showCloseButton?: boolean
}

const Drawer = ({
  isOpen,
  onClose,
  children,
  position = 'left',
  title,
  showCloseButton = true
}: DrawerProps) => {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  const positions = {
    left: 'left-0',
    right: 'right-0',
  }
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`
        absolute top-0 h-full w-full max-w-md bg-white
        ${positions[position]}
        animate-in slide-in-from-${position}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="h-[calc(100vh-73px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Специализированный Drawer для фильтров оборудования
const EquipmentFiltersDrawer = ({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  
  const priceRanges = [
    { label: 'До 1 000 ₽', value: '0-1000' },
    { label: '1 000 - 5 000 ₽', value: '1000-5000' },
    { label: '5 000 - 10 000 ₽', value: '5000-10000' },
    { label: 'От 10 000 ₽', value: '10000+' },
  ]
  
  const equipmentTypes = [
    { label: 'Аудио оборудование', value: 'audio' },
    { label: 'Видео оборудование', value: 'video' },
    { label: 'Световое оборудование', value: 'lighting' },
    { label: 'Мебель и декорации', value: 'furniture' },
    { label: 'Площадки', value: 'venue' },
  ]
  
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      title="Фильтры"
    >
      <div className="space-y-6">
        {/* Ценовой диапазон */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Цена за день</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="price"
                  value={range.value}
                  className="mr-3 h-4 w-4 border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Тип оборудования */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Тип оборудования</h3>
          <div className="space-y-2">
            {equipmentTypes.map((type) => (
              <label key={type.value} className="flex items-center">
                <input
                  type="checkbox"
                  value={type.value}
                  className="mr-3 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Даты доступности */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Даты аренды</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-gray-700">С</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-700">По</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Кнопки действий */}
        <div className="sticky bottom-0 mt-8 flex gap-3 bg-white pt-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium hover:bg-gray-50"
          >
            Сбросить
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
          >
            Применить
          </button>
        </div>
      </div>
    </Drawer>
  )
}

export { Drawer, EquipmentFiltersDrawer }