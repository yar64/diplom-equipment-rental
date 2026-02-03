// shared/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Для объединения классов Tailwind
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Парсинг JSON строк из SQLite
export function parseJsonField<T>(jsonString: string): T {
    try {
        return JSON.parse(jsonString)
    } catch {
        return [] as unknown as T
    }
}

// Форматирование даты
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('ru-RU', options || defaultOptions)
}

// Форматирование цены
export function formatPrice(price: number, currency: string = '₽'): string {
    return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price) + ' ' + currency
}

// Создание слага
export function createSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()
}

// Валидация email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Валидация телефона
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
}