// components/ui/dropdown.tsx
'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { MoreVertical, Edit, Trash2, Eye, Download } from 'lucide-react'

interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode
  onClick: () => void
  destructive?: boolean
}

interface DropdownProps {
  items: DropdownItem[]
  align?: 'left' | 'right'
  trigger?: ReactNode
  className?: string
}

const Dropdown = ({
  items,
  align = 'right',
  trigger,
  className = ''
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const alignments = {
    left: 'left-0',
    right: 'right-0',
  }
  
  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        {trigger || <MoreVertical className="h-5 w-5" />}
      </button>
      
      {isOpen && (
        <div className={`
          absolute z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg
          ${alignments[align]}
        `}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick()
                setIsOpen(false)
              }}
              className={`
                flex w-full items-center gap-2 px-3 py-2 text-sm
                ${item.destructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              {item.icon && <span className="h-4 w-4">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Специализированный Dropdown для действий с оборудованием
const EquipmentActionsDropdown = ({
  onEdit,
  onDelete,
  onView,
  onExport
}: {
  onEdit: () => void
  onDelete: () => void
  onView: () => void
  onExport?: () => void
}) => {
  
  const items: DropdownItem[] = [
    {
      id: 'view',
      label: 'Просмотреть',
      icon: <Eye className="h-4 w-4" />,
      onClick: onView,
    },
    {
      id: 'edit',
      label: 'Редактировать',
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
    },
    ...(onExport ? [{
      id: 'export',
      label: 'Экспортировать',
      icon: <Download className="h-4 w-4" />,
      onClick: onExport,
    }] : []),
    {
      id: 'delete',
      label: 'Удалить',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: onDelete,
      destructive: true,
    },
  ]
  
  return <Dropdown items={items} />
}

export { Dropdown, EquipmentActionsDropdown }