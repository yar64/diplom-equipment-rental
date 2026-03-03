// components/ui/badge.tsx
import { ReactNode } from 'react'
import { Check, Clock, X, AlertCircle, Star } from 'lucide-react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: 'check' | 'clock' | 'x' | 'alert' | 'star' | ReactNode
  className?: string
}

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  icon,
  className = '' 
}: BadgeProps) => {
  
  const variants = {
    default: 'bg-gray-100 text-gray-900',
    primary: 'bg-black text-white',
    secondary: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 text-gray-900',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }
  
  const iconMap = {
    check: <Check className="h-3 w-3" />,
    clock: <Clock className="h-3 w-3" />,
    x: <X className="h-3 w-3" />,
    alert: <AlertCircle className="h-3 w-3" />,
    star: <Star className="h-3 w-3" />,
  }
  
  const IconComponent = typeof icon === 'string' ? iconMap[icon as keyof typeof iconMap] : icon
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {icon && (
        <span className="flex items-center">
          {IconComponent}
        </span>
      )}
      {children}
    </span>
  )
}

// Специализированные бейджи для аренды
const AvailabilityBadge = ({ status }: { status: 'available' | 'booked' | 'limited' }) => {
  const config = {
    available: {
      variant: 'success' as const,
      icon: 'check' as const,
      text: 'Доступно',
    },
    booked: {
      variant: 'danger' as const,
      icon: 'x' as const,
      text: 'Забронировано',
    },
    limited: {
      variant: 'warning' as const,
      icon: 'alert' as const,
      text: 'Ограниченно',
    },
  }
  
  const { variant, icon, text } = config[status]
  
  return <Badge variant={variant} icon={icon}>{text}</Badge>
}

const EquipmentTypeBadge = ({ type }: { type: 'audio' | 'video' | 'lighting' | 'furniture' | 'venue' }) => {
  const types = {
    audio: { text: 'Аудио', color: 'bg-blue-100 text-blue-800' },
    video: { text: 'Видео', color: 'bg-purple-100 text-purple-800' },
    lighting: { text: 'Свет', color: 'bg-yellow-100 text-yellow-800' },
    furniture: { text: 'Мебель', color: 'bg-green-100 text-green-800' },
    venue: { text: 'Площадка', color: 'bg-red-100 text-red-800' },
  }
  
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${types[type].color}`}>
      {types[type].text}
    </span>
  )
}

export { Badge, AvailabilityBadge, EquipmentTypeBadge }