// components/admin/FilterDropdown.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Filter, Check, X, Calendar, Users, Package, Tag, Star, Clock } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface FilterOption {
    id: string
    label: string
    type: 'checkbox' | 'radio' | 'date' | 'range'
    options?: { value: string; label: string }[]
}

export default function FilterDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Определяем фильтры в зависимости от текущей страницы
    const getFiltersForPage = (): FilterOption[] => {
        if (pathname.includes('/admin/users')) {
            return [
                {
                    id: 'role',
                    label: 'Роль',
                    type: 'checkbox',
                    options: [
                        { value: 'ADMIN', label: 'Администраторы' },
                        { value: 'MANAGER', label: 'Менеджеры' },
                        { value: 'STAFF', label: 'Сотрудники' },
                        { value: 'CUSTOMER', label: 'Клиенты' },
                    ]
                },
                {
                    id: 'date',
                    label: 'Дата регистрации',
                    type: 'date',
                }
            ]
        }

        if (pathname.includes('/admin/equipment')) {
            return [
                {
                    id: 'category',
                    label: 'Категория',
                    type: 'checkbox',
                    options: [
                        { value: 'audio', label: 'Аудио' },
                        { value: 'video', label: 'Видео' },
                        { value: 'light', label: 'Свет' },
                        { value: 'stage', label: 'Сцена' },
                    ]
                },
                {
                    id: 'status',
                    label: 'Статус',
                    type: 'radio',
                    options: [
                        { value: 'available', label: 'Доступно' },
                        { value: 'unavailable', label: 'Недоступно' },
                        { value: 'all', label: 'Все' },
                    ]
                },
                {
                    id: 'price',
                    label: 'Цена за день',
                    type: 'range',
                }
            ]
        }

        if (pathname.includes('/admin/bookings') || pathname.includes('/admin/active')) {
            return [
                {
                    id: 'status',
                    label: 'Статус',
                    type: 'checkbox',
                    options: [
                        { value: 'PENDING', label: 'Ожидание' },
                        { value: 'CONFIRMED', label: 'Подтверждено' },
                        { value: 'ACTIVE', label: 'Активно' },
                        { value: 'COMPLETED', label: 'Завершено' },
                        { value: 'CANCELLED', label: 'Отменено' },
                    ]
                },
                {
                    id: 'period',
                    label: 'Период',
                    type: 'radio',
                    options: [
                        { value: 'today', label: 'Сегодня' },
                        { value: 'week', label: 'Неделя' },
                        { value: 'month', label: 'Месяц' },
                        { value: 'all', label: 'Все' },
                    ]
                }
            ]
        }

        if (pathname.includes('/admin/payments')) {
            return [
                {
                    id: 'status',
                    label: 'Статус оплаты',
                    type: 'checkbox',
                    options: [
                        { value: 'PAID', label: 'Оплачено' },
                        { value: 'PENDING', label: 'Ожидание' },
                        { value: 'FAILED', label: 'Ошибка' },
                        { value: 'REFUNDED', label: 'Возврат' },
                    ]
                }
            ]
        }

        // По умолчанию
        return [
            {
                id: 'sort',
                label: 'Сортировка',
                type: 'radio',
                options: [
                    { value: 'new', label: 'Сначала новые' },
                    { value: 'old', label: 'Сначала старые' },
                ]
            }
        ]
    }

    const filters = getFiltersForPage()
    const hasActiveFilters = activeFilters.length > 0

    // Закрытие при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Загрузка активных фильтров из URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        const active: string[] = []
        params.forEach((_, key) => {
            active.push(key)
        })
        setActiveFilters(active)
    }, [searchParams])

    const toggleFilter = (filterId: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const key = `${filterId}_${value}`

        if (params.has(key)) {
            params.delete(key)
            setActiveFilters(prev => prev.filter(f => f !== key))
        } else {
            params.set(key, 'true')
            setActiveFilters(prev => [...prev, key])
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    const clearAllFilters = () => {
        router.push(pathname)
        setActiveFilters([])
        setIsOpen(false)
    }

    // Получить название страницы для отображения
    const getPageTitle = () => {
        if (pathname.includes('/admin/users')) return 'пользователей'
        if (pathname.includes('/admin/equipment')) return 'оборудования'
        if (pathname.includes('/admin/bookings')) return 'бронирований'
        if (pathname.includes('/admin/active')) return 'аренд'
        if (pathname.includes('/admin/payments')) return 'платежей'
        if (pathname.includes('/admin/categories')) return 'категорий'
        return ''
    }

    return (
        <div className="relative">
            {/* Кнопка фильтра */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`
          p-2.5 border border-input rounded-lg hover:bg-accent 
          transition-smooth relative
          ${hasActiveFilters
                        ? 'text-primary border-primary/50 bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground'
                    }
        `}
            >
                <Filter className="w-4 h-4" />
                {hasActiveFilters && (
                    <>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping opacity-75"></span>
                    </>
                )}
            </button>

            {/* Выпадающее меню фильтров */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-80 bg-background border border-input rounded-lg shadow-lg overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in"
                >
                    {/* Заголовок */}
                    <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            <h3 className="font-semibold">Фильтры {getPageTitle()}</h3>
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                            >
                                <X className="w-3 h-3" />
                                <span>Сбросить</span>
                            </button>
                        )}
                    </div>

                    {/* Список фильтров */}
                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {filters.length > 0 ? (
                            filters.map((filter) => (
                                <div key={filter.id} className="mb-4 last:mb-0">
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                        {filter.label}
                                    </div>

                                    {filter.type === 'checkbox' && filter.options && (
                                        <div className="space-y-1">
                                            {filter.options.map((option) => {
                                                const isActive = activeFilters.includes(`${filter.id}_${option.value}`)
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => toggleFilter(filter.id, option.value)}
                                                        className={`
                              w-full flex items-center justify-between px-2 py-1.5 rounded-md
                              hover:bg-accent transition-colors text-sm
                              ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                            `}
                                                    >
                                                        <span>{option.label}</span>
                                                        {isActive && <Check className="w-3 h-3" />}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {filter.type === 'radio' && filter.options && (
                                        <div className="space-y-1">
                                            {filter.options.map((option) => {
                                                const isActive = activeFilters.includes(`${filter.id}_${option.value}`)
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            // Для радио очищаем другие значения этого фильтра
                                                            const params = new URLSearchParams(searchParams.toString())
                                                            filter.options?.forEach(opt => {
                                                                params.delete(`${filter.id}_${opt.value}`)
                                                            })
                                                            params.set(`${filter.id}_${option.value}`, 'true')
                                                            router.push(`${pathname}?${params.toString()}`)
                                                            setActiveFilters([`${filter.id}_${option.value}`])
                                                        }}
                                                        className={`
                              w-full flex items-center justify-between px-2 py-1.5 rounded-md
                              hover:bg-accent transition-colors text-sm
                              ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                            `}
                                                    >
                                                        <span>{option.label}</span>
                                                        {isActive && (
                                                            <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                                            </div>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {filter.type === 'date' && (
                                        <div className="px-2 py-1.5">
                                            <input
                                                type="date"
                                                className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        const params = new URLSearchParams(searchParams.toString())
                                                        params.set(`${filter.id}_date`, e.target.value)
                                                        router.push(`${pathname}?${params.toString()}`)
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}

                                    {filter.type === 'range' && (
                                        <div className="px-2 py-1.5">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="От"
                                                    className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            const params = new URLSearchParams(searchParams.toString())
                                                            params.set(`${filter.id}_min`, e.target.value)
                                                            router.push(`${pathname}?${params.toString()}`)
                                                        }
                                                    }}
                                                />
                                                <span className="text-muted-foreground">—</span>
                                                <input
                                                    type="number"
                                                    placeholder="До"
                                                    className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            const params = new URLSearchParams(searchParams.toString())
                                                            params.set(`${filter.id}_max`, e.target.value)
                                                            router.push(`${pathname}?${params.toString()}`)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-muted-foreground">
                                <p className="text-sm">Нет доступных фильтров</p>
                                <p className="text-xs mt-1">На этой странице нельзя применить фильтры</p>
                            </div>
                        )}
                    </div>

                    {/* Подсказка */}
                    <div className="p-2 border-t border-border bg-muted/30 text-xs text-muted-foreground text-center">
                        Фильтры применяются автоматически
                    </div>
                </div>
            )}
        </div>
    )
}