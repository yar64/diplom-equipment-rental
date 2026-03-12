// shared/types.ts
import { Prisma } from '@prisma/client'
// ==================== БАЗОВЫЕ ТИПЫ ====================

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL'
export type NotificationType = 'BOOKING_UPDATE' | 'PAYMENT' | 'SYSTEM' | 'PROMOTION' | 'REMINDER' | 'MAINTENANCE'

// ==================== МОДЕЛЬНЫЕ ТИПЫ ====================

export type EquipmentWithDetails = Prisma.EquipmentGetPayload<{
    include: {
        category: true
        reviews: {
            include: {
                user: {
                    select: {
                        name: true
                        avatar: true
                    }
                }
            }
        }
    }
}>

// Тип для списка оборудования с пагинацией (то что возвращает getEquipment)
export type EquipmentListItem = Prisma.EquipmentGetPayload<{
    include: {
        category: true
        reviews: {
            include: {
                user: {
                    select: {
                        name: true
                        avatar: true
                    }
                }
            }
        }
    }
}>

// Для ответа с пагинацией
export interface PaginatedEquipmentResponse {
    items: EquipmentListItem[]
    total: number
    page: number
    limit: number
    totalPages: number
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
    page?: number        // новый
    limit?: number       // новый
}

// Для таблиц админки
export interface TableColumn<T> {
    key: keyof T | string
    title: string
    width?: string
    sortable?: boolean
    render?: (value: any, item: T) => React.ReactNode
}

// Расширение типа для ответов от экшенов
export interface ActionResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Тип для категории с оборудованием
export interface CategoryWithStats extends Category {
    _count?: {
        equipment: number
        children: number
    }
}

export interface InventorySummary {
    summary: {
        totalEquipment: number
        totalItems: number
        availableEquipment: number
        lowStockEquipment: number
        outOfStockEquipment: number
    }
    categories: Array<{
        name: string
        itemCount: number
        bookingCount: number
    }>
    lowStockItems: Array<{
        id: string
        name: string
        quantity: number
        pricePerDay: number
        category: {
            name: string
        }
    }>
    recentlyAdded: Array<{
        id: string
        name: string
        quantity: number
        createdAt: Date
        category: {
            name: string
        }
    }>
}

export interface InventoryHistoryItem {
    id: string
    action: string
    equipmentName: string
    equipmentId: string
    userName: string | null
    userId: string | null
    quantity?: number
    details: string
    createdAt: Date
}

export interface InventoryLogData {
    equipmentId: string
    userId?: string
    action: string
    field?: string
    oldValue?: string
    newValue?: string
    quantity?: number
    reason?: string
}