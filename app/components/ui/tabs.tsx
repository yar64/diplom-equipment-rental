// components/ui/tabs.tsx
'use client'

import { useState, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'underline' | 'pills'
  className?: string
}

const Tabs = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className = ''
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }
  
  const variants = {
    default: 'border-b border-gray-200',
    underline: 'border-b border-gray-200',
    pills: 'gap-1 rounded-lg bg-gray-100 p-1',
  }
  
  const tabVariants = {
    default: {
      base: 'px-4 py-3 font-medium text-sm',
      active: 'border-b-2 border-black text-black',
      inactive: 'text-gray-500 hover:text-gray-700',
    },
    underline: {
      base: 'px-4 py-3 font-medium text-sm',
      active: 'border-b-2 border-black text-black',
      inactive: 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent',
    },
    pills: {
      base: 'px-4 py-2 font-medium text-sm rounded-md',
      active: 'bg-white text-black shadow-sm',
      inactive: 'text-gray-600 hover:text-gray-900',
    },
  }
  
  return (
    <div className={`
      flex ${variant === 'pills' ? '' : 'space-x-2'}
      ${variants[variant]}
      ${className}
    `}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`
            flex items-center gap-2 whitespace-nowrap transition-colors
            ${tabVariants[variant].base}
            ${activeTab === tab.id ? tabVariants[variant].active : tabVariants[variant].inactive}
          `}
        >
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className={`
              rounded-full px-2 py-0.5 text-xs
              ${activeTab === tab.id ? 'bg-gray-100' : 'bg-gray-200'}
            `}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// Специализированные табы для каталога аренды
const EquipmentCatalogTabs = () => {
  const catalogTabs = [
    { id: 'equipment', label: 'Оборудование', count: 156 },
    { id: 'venues', label: 'Площадки', count: 24 },
    { id: 'packages', label: 'Пакеты услуг', count: 12 },
    { id: 'favorites', label: 'Избранное', count: 8 },
  ]
  
  return <Tabs tabs={catalogTabs} variant="underline" />
}

// Табы для статусов заказов
const OrderStatusTabs = () => {
  const statusTabs = [
    { id: 'active', label: 'Активные', count: 3 },
    { id: 'upcoming', label: 'Предстоящие', count: 5 },
    { id: 'completed', label: 'Завершенные', count: 24 },
    { id: 'cancelled', label: 'Отмененные', count: 2 },
  ]
  
  return <Tabs tabs={statusTabs} variant="pills" />
}

export { Tabs, EquipmentCatalogTabs, OrderStatusTabs }