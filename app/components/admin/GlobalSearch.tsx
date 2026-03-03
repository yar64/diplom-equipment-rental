// components/admin/GlobalSearch.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
    Search,
    X,
    Package,
    Users,
    Calendar,
    Folder,
    Loader2,
    ChevronRight,
    User,
    Mail,
    Phone,
    CalendarDays,
    Hash
} from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '../../../hooks/useDebounce'
import { getEquipment } from '../../../server/actions/equipment.actions'
import { getUsers } from '../../../server/actions/user.actions'
import { getAllBookings } from '../../../server/actions/booking.actions'
import { getCategories } from '../../../server/actions/category.actions'

// Типы для результатов поиска
interface SearchResult {
    equipment: any[]
    users: any[]
    bookings: any[]
    categories: any[]
}

interface GlobalSearchProps {
    onClose?: () => void
    className?: string
    placeholder?: string
    autoFocus?: boolean
}

export default function GlobalSearch({
    onClose,
    className = '',
    placeholder = 'Поиск оборудования, клиентов, заказов...',
    autoFocus = false
}: GlobalSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult>({
        equipment: [],
        users: [],
        bookings: [],
        categories: []
    })
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [totalResults, setTotalResults] = useState(0)

    const debouncedQuery = useDebounce(query, 300)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Поиск при изменении debounced запроса
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setResults({ equipment: [], users: [], bookings: [], categories: [] })
                setTotalResults(0)
                return
            }

            setLoading(true)
            try {
                // Запускаем все поисковые запросы параллельно
                const [equipmentRes, usersRes, bookingsRes, categoriesRes] = await Promise.all([
                    getEquipment({ search: debouncedQuery, limit: 5 }),
                    getUsers({ search: debouncedQuery }),
                    getAllBookings({ search: debouncedQuery }),
                    getCategories()
                ])

                // Фильтруем категории на клиенте (так как в getCategories нет поиска)
                const allCategories = categoriesRes.success ? categoriesRes.data || [] : []
                const filteredCategories = allCategories.filter((cat: any) =>
                    cat.name.toLowerCase().includes(debouncedQuery.toLowerCase())
                ).slice(0, 3)

                const newResults = {
                    equipment: equipmentRes.success ? (equipmentRes.data || []).slice(0, 5) : [],
                    users: usersRes.success ? (usersRes.data || []).slice(0, 3) : [],
                    bookings: bookingsRes.success ? (bookingsRes.data || []).slice(0, 3) : [],
                    categories: filteredCategories
                }

                setResults(newResults)

                // Подсчитываем общее количество результатов
                const total = Object.values(newResults).reduce((acc, curr) => acc + curr.length, 0)
                setTotalResults(total)

                setShowResults(true)
                setSelectedIndex(-1)
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(false)
            }
        }

        performSearch()
    }, [debouncedQuery])

    // Закрытие при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
                if (onClose) onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    // Обработка клавиш клавиатуры
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showResults || totalResults === 0) return

        // Создаем плоский список всех результатов для навигации
        const flatResults = [
            ...results.equipment.map(item => ({ type: 'equipment', data: item })),
            ...results.users.map(item => ({ type: 'users', data: item })),
            ...results.bookings.map(item => ({ type: 'bookings', data: item })),
            ...results.categories.map(item => ({ type: 'categories', data: item }))
        ]

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev => (prev < flatResults.length - 1 ? prev + 1 : prev))
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && flatResults[selectedIndex]) {
                    const selected = flatResults[selectedIndex]
                    handleSelect(selected.type, selected.data)
                }
                break
            case 'Escape':
                setShowResults(false)
                if (onClose) onClose()
                break
        }
    }

    const handleSelect = (type: string, item: any) => {
        setShowResults(false)
        setQuery('')

        // Формируем URL в зависимости от типа
        let url = ''
        switch (type) {
            case 'equipment':
                url = '/admin/equipment'
                break
            case 'users':
                url = '/admin/users'
                break
            case 'bookings':
                url = '/admin/bookings'
                break
            case 'categories':
                url = '/admin/categories'
                break
        }

        // Здесь можно добавить якорь для прокрутки к конкретному элементу
        // Например: `/admin/equipment#item-${item.id}`

        window.location.href = url
    }

    const clearSearch = () => {
        setQuery('')
        setResults({ equipment: [], users: [], bookings: [], categories: [] })
        setShowResults(false)
        inputRef.current?.focus()
    }

    // Форматирование статуса бронирования
    const getBookingStatusLabel = (status: string) => {
        const statuses: Record<string, string> = {
            PENDING: 'Ожидание',
            CONFIRMED: 'Подтверждено',
            ACTIVE: 'Активно',
            COMPLETED: 'Завершено',
            CANCELLED: 'Отменено'
        }
        return statuses[status] || status
    }

    const getBookingStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
            ACTIVE: 'bg-green-100 text-green-700 border-green-200',
            COMPLETED: 'bg-gray-100 text-gray-700 border-gray-200',
            CANCELLED: 'bg-red-100 text-red-700 border-red-200'
        }
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
    }

    // Рендер группы результатов
    const renderGroup = (title: string, icon: React.ReactNode, items: any[], type: string, renderItem: (item: any) => React.ReactNode) => {
        if (items.length === 0) return null

        return (
            <div className="border-b border-border last:border-0">
                <div className="px-3 py-2 bg-muted/30 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    {icon}
                    <span>{title}</span>
                    <span className="ml-auto text-xs">{items.length}</span>
                </div>
                <div className="py-1">
                    {items.map((item, idx) => renderItem(item))}
                </div>
            </div>
        )
    }

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            {/* Поле ввода */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && totalResults > 0 && setShowResults(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="w-full pl-10 pr-10 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                )}
            </div>

            {/* Выпадающий список результатов */}
            {showResults && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {totalResults > 0 ? (
                        <div className="max-h-[70vh] overflow-y-auto">
                            {/* Оборудование */}
                            {renderGroup(
                                'Оборудование',
                                <Package className="w-3 h-3" />,
                                results.equipment,
                                'equipment',
                                (item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelect('equipment', item)}
                                        className="w-full px-3 py-2 hover:bg-accent flex items-center gap-3 text-left group"
                                    >
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{item.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.category?.name || 'Без категории'} • {item.pricePerDay} ₽/день
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                )
                            )}

                            {/* Пользователи */}
                            {renderGroup(
                                'Пользователи',
                                <Users className="w-3 h-3" />,
                                results.users,
                                'users',
                                (item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelect('users', item)}
                                        className="w-full px-3 py-2 hover:bg-accent flex items-center gap-3 text-left group"
                                    >
                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{item.name || 'Без имени'}</div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate">{item.email}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                )
                            )}

                            {/* Бронирования */}
                            {renderGroup(
                                'Бронирования',
                                <Calendar className="w-3 h-3" />,
                                results.bookings,
                                'bookings',
                                (item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelect('bookings', item)}
                                        className="w-full px-3 py-2 hover:bg-accent flex items-center gap-3 text-left group"
                                    >
                                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CalendarDays className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">#{item.id}</span>
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full border ${getBookingStatusColor(item.status)}`}>
                                                    {getBookingStatusLabel(item.status)}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.equipment?.name || 'Оборудование'} • {item.user?.name || item.user?.email}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                )
                            )}

                            {/* Категории */}
                            {renderGroup(
                                'Категории',
                                <Folder className="w-3 h-3" />,
                                results.categories,
                                'categories',
                                (item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelect('categories', item)}
                                        className="w-full px-3 py-2 hover:bg-accent flex items-center gap-3 text-left group"
                                    >
                                        <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Folder className="w-4 h-4 text-green-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{item.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item._count?.equipment || 0} ед. оборудования
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                )
                            )}
                        </div>
                    ) : debouncedQuery.length >= 2 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <div className="flex justify-center mb-2">
                                <Search className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="text-sm">Ничего не найдено</p>
                            <p className="text-xs mt-1">Попробуйте изменить запрос</p>
                        </div>
                    ) : null}

                    {/* Подсказка по навигации */}
                    {totalResults > 0 && (
                        <div className="p-2 border-t border-border bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span>↑↓ для навигации</span>
                                <span>↵ для выбора</span>
                            </div>
                            <span>ESC для закрытия</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}