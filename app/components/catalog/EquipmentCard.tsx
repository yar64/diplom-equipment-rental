// components/EquipmentCard.tsx
"use client"

import { Star, ShoppingCart, Check, Zap, Truck, Wrench } from 'lucide-react'
import { EquipmentItem } from '../shared/types'

interface EquipmentCardProps {
  item: EquipmentItem
  onAddToCart: () => void
  isInCart: boolean
}

export default function EquipmentCard({ item, onAddToCart, isInCart }: EquipmentCardProps) {
  return (
    <div className="group relative bg-background border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
      {/* Бейдж доступности */}
      <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-full text-xs font-medium ${
        item.available 
          ? 'bg-green-500/20 text-green-600' 
          : 'bg-red-500/20 text-red-600'
      }`}>
        {item.available ? 'Доступно' : 'Занято'}
      </div>

      {/* Изображение */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary/50 to-background">
        <div 
          className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${item.image})` }}
        />
        
        {/* Наложение с анимацией подключения */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Подключено</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>Готово к работе</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="p-4">
        {/* Категория */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground">
            {item.category}
          </span>
          
          {/* Рейтинг */}
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium">{item.rating}</span>
            <span className="text-xs text-muted-foreground">({item.reviews})</span>
          </div>
        </div>

        {/* Название */}
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        {/* Описание */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Характеристики */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {Object.entries(item.specs).map(([key, value]) => (
              <div key={key} className="text-xs">
                <div className="text-muted-foreground capitalize">{key}:</div>
                <div className="font-medium">{value}</div>
              </div>
            ))}
          </div>

          {/* Теги */}
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <span 
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
            {item.deliveryAvailable && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-600 border border-green-500/20 flex items-center gap-1">
                <Truck className="w-2.5 h-2.5" />
                Доставка
              </span>
            )}
            {item.setupIncluded && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center gap-1">
                <Wrench className="w-2.5 h-2.5" />
                Установка
              </span>
            )}
          </div>
        </div>

        {/* Цена и кнопка */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {item.price.toLocaleString()} ₽
            </div>
            <div className="text-xs text-muted-foreground">в сутки</div>
          </div>

          <button
            onClick={onAddToCart}
            disabled={!item.available || isInCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isInCart
                ? 'bg-green-500 text-white'
                : item.available
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                Добавлено
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                В корзину
              </>
            )}
          </button>
        </div>
      </div>

      {/* Анимация подключения при наведении */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-all duration-300 pointer-events-none" />
    </div>
  )
}