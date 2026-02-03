// shared/types.ts

// ==================== БАЗОВЫЕ ТИПЫ ====================

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL'
export type NotificationType = 'BOOKING_UPDATE' | 'PAYMENT' | 'SYSTEM' | 'PROMOTION' | 'REMINDER' | 'MAINTENANCE'

// ==================== API ТИПЫ ====================

// Тип для ответа серверных действий
export interface ActionResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Тип для избранного
export interface FavoriteResponse {
    isFavorite: boolean
}

// Тип для фильтров оборудования
export interface EquipmentFilters {
    categoryId?: string
    search?: string
    featured?: boolean
    minPrice?: number
    maxPrice?: number
    limit?: number
}

// ==================== МОДЕЛЬНЫЕ ТИПЫ ====================

export interface Equipment {
    id: string
    name: string
    slug: string
    description?: string
    fullDescription?: string
    pricePerDay: number
    pricePerWeek?: number
    pricePerMonth?: number
    quantity: number
    available: boolean
    featured: boolean
    rating?: number
    reviewCount: number
    images: string  // JSON string в SQLite
    mainImage?: string
    powerRequirements?: string
    weight?: number
    dimensions?: string
    brand?: string
    model?: string
    serialNumber?: string
    categoryId: string
    createdAt: Date
    updatedAt: Date

    // Опциональные связи
    category?: Category
    bookings?: Booking[]
    favorites?: Favorite[]
    reviews?: Review[]
}

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    image?: string
    icon?: string
    parentId?: string
    createdAt: Date
    updatedAt: Date

    // Опциональные связи
    parent?: Category
    children?: Category[]
    equipment?: Equipment[]

    // Для статистики
    _count?: {
        equipment?: number
        children?: number
    }
}

export interface User {
    id: string
    email: string
    password: string
    name?: string
    phone?: string
    avatar?: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
}

export interface Booking {
    id: string
    status: BookingStatus
    startDate: Date
    endDate: Date
    totalDays: number
    totalPrice: number
    notes?: string
    eventType?: string
    eventAddress?: string
    eventDate?: Date
    attendeesCount?: number
    createdAt: Date
    updatedAt: Date
    userId: string
    equipmentId: string
    paymentId?: string
    paymentStatus: PaymentStatus
    paymentMethod?: string
}

export interface Favorite {
    id: string
    userId: string
    equipmentId: string
    createdAt: Date
}

export interface Review {
    id: string
    rating: number
    comment?: string
    isVerified: boolean
    userId: string
    equipmentId: string
    createdAt: Date
    updatedAt: Date
}