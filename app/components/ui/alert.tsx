// components/ui/alert.tsx
import { ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, XCircle, Bell } from 'lucide-react'

interface AlertProps {
  children: ReactNode
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'rental'
  size?: 'sm' | 'md' | 'lg'
  icon?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const Alert = ({
  children,
  variant = 'default',
  size = 'md',
  icon = true,
  dismissible = false,
  onDismiss,
  className = ''
}: AlertProps) => {
  
  const variants = {
    default: 'bg-gray-50 text-gray-900 border-gray-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    error: 'bg-red-50 text-red-900 border-red-200',
    rental: 'bg-gradient-to-r from-gray-900 to-black text-white border-black',
  }
  
  const iconMap = {
    default: <Info className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    rental: <Bell className="h-5 w-5" />,
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }
  
  return (
    <div className={`
      relative rounded-lg border
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0">
            {iconMap[variant]}
          </div>
        )}
        
        <div className="flex-1">
          {children}
        </div>
        
        {dismissible && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-current hover:opacity-70"
          >
            <span className="sr-only">Закрыть</span>
            <span className="h-4 w-4">×</span>
          </button>
        )}
      </div>
    </div>
  )
}

// Специализированные алерты для аренды
const RentalAlert = ({ 
  type,
  date,
  equipment
}: {
  type: 'booking_confirmed' | 'payment_required' | 'equipment_available'
  date?: string
  equipment?: string
}) => {
  
  const alerts = {
    booking_confirmed: {
      variant: 'success' as const,
      title: 'Бронирование подтверждено!',
      message: `Оборудование "${equipment}" успешно забронировано на ${date}.`,
    },
    payment_required: {
      variant: 'warning' as const,
      title: 'Требуется оплата депозита',
      message: 'Для подтверждения бронирования необходимо внести депозит в течение 24 часов.',
    },
    equipment_available: {
      variant: 'rental' as const,
      title: 'Оборудование снова доступно!',
      message: `"${equipment}" теперь доступно для аренды.`,
    },
  }
  
  const alert = alerts[type]
  
  return (
    <Alert variant={alert.variant} icon={true}>
      <div className="font-semibold">{alert.title}</div>
      <div className="mt-1 text-sm opacity-90">{alert.message}</div>
    </Alert>
  )
}

export { Alert, RentalAlert }