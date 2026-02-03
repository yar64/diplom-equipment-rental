// shared/types.ts

// ==================== БАЗОВЫЕ ТИПЫ ====================

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL'
export type NotificationType = 'BOOKING_UPDATE' | 'PAYMENT' | 'SYSTEM' | 'PROMOTION' | 'REMINDER' | 'MAINTENANCE'

// ==================== МОДЕЛЬНЫЕ ТИПЫ ====================

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

    // Опциональные связи
    user?: User
    equipment?: Equipment
}

export interface Favorite {
    id: string
    userId: string
    equipmentId: string
    createdAt: Date

    // Опциональные связи
    user?: User
    equipment?: Equipment
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

    // Опциональные связи
    user?: User
    equipment?: Equipment
}

export interface Staff {
    id: string
    userId: string
    position: string
    permissions: string  // JSON string в SQLite
    department?: string
    createdAt: Date
    updatedAt: Date

    // Опциональные связи
    user?: User
}

export interface Notification {
    id: string
    userId: string
    type: NotificationType
    title: string
    message: string
    read: boolean
    link?: string
    createdAt: Date

    // Опциональные связи
    user?: User
}

export interface Cart {
    id: string
    userId?: string
    sessionId?: string
    items: any  // JSON data
    createdAt: Date
    updatedAt: Date
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ====================

// Для форм
export interface EquipmentFormData {
    name: string
    description?: string
    fullDescription?: string
    pricePerDay: number
    pricePerWeek?: number
    pricePerMonth?: number
    quantity: number
    available: boolean
    featured: boolean
    images: string[]
    mainImage?: string
    powerRequirements?: string
    weight?: number
    dimensions?: string
    brand?: string
    model?: string
    serialNumber?: string
    categoryId: string
}

export interface CategoryFormData {
    name: string
    description?: string
    parentId?: string
}

export interface BookingFormData {
    userId: string
    equipmentId: string
    startDate: Date
    endDate: Date
    notes?: string
    eventType?: string
    eventAddress?: string
    eventDate?: Date
    attendeesCount?: number
}

// Для API ответов
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
}

// Для пагинации
export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// Для фильтров
export interface EquipmentFilters {
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    available?: boolean
    featured?: boolean
    search?: string
}

// Для таблиц админки
export interface TableColumn<T> {
    key: keyof T | string
    title: string
    width?: string
    sortable?: boolean
    render?: (value: any, item: T) => React.ReactNode
}