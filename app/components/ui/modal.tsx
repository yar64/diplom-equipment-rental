// components/ui/modal.tsx
'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true
}: ModalProps) => {
  
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
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className={`
        relative z-10 mx-4 w-full rounded-lg bg-white
        ${sizes[size]}
        animate-in fade-in-0 zoom-in-95
      `}>
        {/* Header */}
        {(title || showCloseButton) && (
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
        )}
        
        {/* Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Специализированная модалка для бронирования
const RentalModal = ({
  isOpen,
  onClose,
  equipment,
  onConfirm
}: {
  isOpen: boolean
  onClose: () => void
  equipment: {
    title: string
    price: number
    image: string
  }
  onConfirm: (data: any) => void
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Бронирование оборудования"
      size="md"
    >
      <div className="space-y-6">
        {/* Информация об оборудовании */}
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200" />
          <div>
            <h3 className="font-semibold text-gray-900">{equipment.title}</h3>
            <p className="mt-1 text-2xl font-bold text-gray-900">{equipment.price} ₽/день</p>
          </div>
        </div>
        
        {/* Форма бронирования */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Дата начала
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Дата окончания
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Количество
            </label>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-gray-300 px-3 py-1">
                -
              </button>
              <input
                type="number"
                defaultValue={1}
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center"
              />
              <button className="rounded-lg border border-gray-300 px-3 py-1">
                +
              </button>
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Дополнительные пожелания
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Укажите дополнительные требования..."
            />
          </div>
        </div>
        
        {/* Итог и кнопки */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Стоимость аренды (3 дня)</span>
            <span className="font-semibold">9 000 ₽</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-600">Депозит</span>
            <span className="font-semibold">5 000 ₽</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
            <span className="font-semibold">Итого к оплате</span>
            <span className="text-xl font-bold">14 000 ₽</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={() => onConfirm({})}
            className="flex-1 rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
          >
            Подтвердить бронирование
          </button>
        </div>
      </div>
    </Modal>
  )
}

export { Modal, RentalModal }