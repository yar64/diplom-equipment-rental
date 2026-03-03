// components/ui/emptystate.tsx
import { Calendar, Search, ShoppingCart, Heart, Package } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = ''
}: EmptyStateProps) => {
  
  const defaultIcons = {
    cart: <ShoppingCart className="h-12 w-12 text-gray-400" />,
    search: <Search className="h-12 w-12 text-gray-400" />,
    favorites: <Heart className="h-12 w-12 text-gray-400" />,
    equipment: <Package className="h-12 w-12 text-gray-400" />,
    calendar: <Calendar className="h-12 w-12 text-gray-400" />,
  }
  
  const IconComponent = typeof icon === 'string' 
    ? defaultIcons[icon as keyof typeof defaultIcons] 
    : icon || defaultIcons.search
  
  return (
    <div className={`
      flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center
      ${className}
    `}>
      <div className="mb-4 text-gray-400">
        {IconComponent}
      </div>
      
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {title}
      </h3>
      
      {description && (
        <p className="mb-6 max-w-md text-gray-500">
          {description}
        </p>
      )}
      
      <div className="flex flex-col gap-3 sm:flex-row">
        {action && (
          <Button
            onClick={action.onClick}
            icon={action.icon}
            variant="primary"
            size="lg"
          >
            {action.label}
          </Button>
        )}
        
        {secondaryAction && (
          <Button
            onClick={secondaryAction.onClick}
            variant="outline"
            size="lg"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// Специализированные EmptyState для аренды

const EmptyCartState = () => (
  <EmptyState
    icon="cart"
    title="Корзина пуста"
    description="Добавьте оборудование в корзину, чтобы начать оформление аренды"
    action={{
      label: "Перейти в каталог",
      onClick: () => window.location.href = '/catalog',
      icon: <Package className="h-4 w-4" />
    }}
  />
)

const EmptyFavoritesState = () => (
  <EmptyState
    icon="favorites"
    title="Избранное пусто"
    description="Сохраняйте понравившееся оборудование, чтобы вернуться к нему позже"
    action={{
      label: "Найти оборудование",
      onClick: () => window.location.href = '/catalog',
      icon: <Search className="h-4 w-4" />
    }}
  />
)

const EmptySearchResultsState = ({ query }: { query: string }) => (
  <EmptyState
    icon="search"
    title={`По запросу "${query}" ничего не найдено`}
    description="Попробуйте изменить поисковый запрос или воспользуйтесь каталогом"
    action={{
      label: "Смотреть всё оборудование",
      onClick: () => window.location.href = '/catalog',
    }}
    secondaryAction={{
      label: "Очистить поиск",
      onClick: () => window.location.href = '/catalog',
    }}
  />
)

const EmptyOrdersState = () => (
  <EmptyState
    icon="calendar"
    title="У вас пока нет заказов"
    description="Арендуйте оборудование для мероприятий и отслеживайте статус заказов здесь"
    action={{
      label: "Арендовать оборудование",
      onClick: () => window.location.href = '/catalog',
      icon: <Calendar className="h-4 w-4" />
    }}
  />
)

export { 
  EmptyState, 
  EmptyCartState, 
  EmptyFavoritesState, 
  EmptySearchResultsState,
  EmptyOrdersState 
}