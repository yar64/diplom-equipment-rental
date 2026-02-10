// app/admin/active/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
    Clock, CheckCircle, XCircle, Package, User,
    Calendar, MapPin, Phone, Mail, AlertCircle,
    Filter, RefreshCw, Eye, MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatPrice } from '@/shared/utils'
import { getAllBookings } from '@/server/actions/booking.actions'

// Типы
interface ActiveBooking {
    id: string
    equipment: {
        id: string
        name: string
        category: { name: string }
    }
    user: {
        id: string
        name?: string
        email: string
        phone?: string
    }
    startDate: string
    endDate: string
    totalDays: number
    totalPrice: number
    eventAddress?: string
    notes?: string
    createdAt: string
}

export default function ActiveRentalsPage() {
    const [loading, setLoading] = useState(true)
    const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([])
    const [filter, setFilter] = useState<'all' | 'today' | 'overdue'>('all')

    useEffect(() => {
        loadActiveBookings()
    }, [filter])

    const loadActiveBookings = async () => {
        setLoading(true)
        try {
            const result = await getAllBookings()
            if (result.success) {
                const allBookings = result.data as any[]

                // Фильтруем активные бронирования
                let filtered = allBookings.filter((booking: any) =>
                    booking.status === 'ACTIVE' || booking.status === 'CONFIRMED'
                )

                // Дополнительная фильтрация
                const now = new Date()
                if (filter === 'today') {
                    filtered = filtered.filter((booking: any) => {
                        const startDate = new Date(booking.startDate)
                        return startDate.toDateString() === now.toDateString()
                    })
                } else if (filter === 'overdue') {
                    filtered = filtered.filter((booking: any) => {
                        const endDate = new Date(booking.endDate)
                        return endDate < now
                    })
                }

                setActiveBookings(filtered)
            }
        } catch (error) {
            console.error('Error loading active bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCompleteRental = async (bookingId: string) => {
        if (confirm('Завершить эту аренду?')) {
            alert(`Завершение аренды ${bookingId} в разработке...`)
            await loadActiveBookings()
        }
    }

    const handleExtendRental = async (bookingId: string) => {
        alert(`Продление аренды ${bookingId} в разработке...`)
    }

    const handleContactUser = (userId: string) => {
        alert(`Контакт с пользователем ${userId} в разработке...`)
    }

    const getDaysRemaining = (endDate: string) => {
        const end = new Date(endDate)
        const now = new Date()
        const diffTime = end.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const getStatusColor = (endDate: string) => {
        const daysRemaining = getDaysRemaining(endDate)
        if (daysRemaining < 0) return 'bg-red-500'
        if (daysRemaining <= 1) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getStatusText = (endDate: string) => {
        const daysRemaining = getDaysRemaining(endDate)
        if (daysRemaining < 0) return 'Просрочено'
        if (daysRemaining === 0) return 'Заканчивается сегодня'
        if (daysRemaining === 1) return 'Завтра заканчивается'
        return `Осталось ${daysRemaining} дней`
    }

    const stats = {
        total: activeBookings.length,
        today: activeBookings.filter(b => {
            const startDate = new Date(b.startDate)
            return startDate.toDateString() === new Date().toDateString()
        }).length,
        overdue: activeBookings.filter(b => {
            const endDate = new Date(b.endDate)
            return endDate < new Date()
        }).length,
        endingSoon: activeBookings.filter(b => {
            const daysRemaining = getDaysRemaining(b.endDate)
            return daysRemaining >= 0 && daysRemaining <= 2
        }).length
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Активные аренды</h1>
                        <div className="h-4 w-64 bg-muted rounded animate-pulse mt-1"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Заголовок */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Активные аренды</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление текущими арендами оборудования
                    </p>
                </div>
                <button
                    onClick={loadActiveBookings}
                    className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Обновить
                </button>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Всего активных</div>
                            <div className="text-2xl font-bold mt-1">{stats.total}</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Package className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Начались сегодня</div>
                            <div className="text-2xl font-bold mt-1">{stats.today}</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Заканчиваются скоро</div>
                            <div className="text-2xl font-bold mt-1">{stats.endingSoon}</div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Просрочены</div>
                            <div className="text-2xl font-bold mt-1">{stats.overdue}</div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-input hover:bg-accent'
                        }`}
                >
                    Все ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('today')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'today'
                            ? 'bg-green-500 text-white'
                            : 'border border-input hover:bg-accent'
                        }`}
                >
                    Сегодня ({stats.today})
                </button>
                <button
                    onClick={() => setFilter('overdue')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'overdue'
                            ? 'bg-red-500 text-white'
                            : 'border border-input hover:bg-accent'
                        }`}
                >
                    Просрочено ({stats.overdue})
                </button>
            </div>

            {/* Список активных аренд */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeBookings.length === 0 ? (
                    <div className="lg:col-span-2 border border-border rounded-lg p-8 text-center">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Нет активных аренд</h3>
                        <p className="text-muted-foreground">В данный момент нет активных аренд оборудования</p>
                        <Link
                            href="/admin/bookings"
                            className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Перейти к бронированиям
                        </Link>
                    </div>
                ) : (
                    activeBookings.map((booking) => {
                        const daysRemaining = getDaysRemaining(booking.endDate)
                        const isOverdue = daysRemaining < 0
                        const isEndingSoon = daysRemaining >= 0 && daysRemaining <= 2

                        return (
                            <div key={booking.id} className="border border-border rounded-lg bg-background overflow-hidden">
                                {/* Заголовок карточки */}
                                <div className={`px-6 py-4 border-b border-border ${isOverdue ? 'bg-red-500/10' : isEndingSoon ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${getStatusColor(booking.endDate)}`}></div>
                                            <div>
                                                <h3 className="font-semibold">{booking.equipment.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.equipment.category.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(booking.endDate)}`}>
                                            {getStatusText(booking.endDate)}
                                        </div>
                                    </div>
                                </div>

                                {/* Информация об аренде */}
                                <div className="p-6 space-y-4">
                                    {/* Информация о клиенте */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Клиент</span>
                                            </div>
                                            <div className="text-right">
                                                <div>{booking.user.name || 'Без имени'}</div>
                                                <div className="text-xs text-muted-foreground">{booking.user.email}</div>
                                            </div>
                                        </div>
                                        {booking.user.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span>{booking.user.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Даты аренды */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span>Начало</span>
                                            </div>
                                            <div className="font-medium">{formatDate(booking.startDate)}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span>Конец</span>
                                            </div>
                                            <div className="font-medium">{formatDate(booking.endDate)}</div>
                                        </div>
                                    </div>

                                    {/* Адрес мероприятия */}
                                    {booking.eventAddress && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <span>Адрес доставки</span>
                                            </div>
                                            <div className="text-sm">{booking.eventAddress}</div>
                                        </div>
                                    )}

                                    {/* Стоимость */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div>
                                            <div className="text-sm text-muted-foreground">Стоимость</div>
                                            <div className="text-2xl font-bold">{formatPrice(booking.totalPrice)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground">Срок</div>
                                            <div className="font-medium">{booking.totalDays} дней</div>
                                        </div>
                                    </div>

                                    {/* Действия */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-border">
                                        <button
                                            onClick={() => handleCompleteRental(booking.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Завершить
                                        </button>
                                        <button
                                            onClick={() => handleExtendRental(booking.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            Продлить
                                        </button>
                                        <button
                                            onClick={() => handleContactUser(booking.user.id)}
                                            className="p-2 border border-input rounded-lg hover:bg-accent transition-colors"
                                            title="Связаться"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                        <Link
                                            href={`/admin/bookings/${booking.id}`}
                                            className="p-2 border border-input rounded-lg hover:bg-accent transition-colors"
                                            title="Подробнее"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Быстрые действия */}
            <div className="border border-border rounded-lg bg-background p-6">
                <h2 className="text-lg font-semibold mb-4">Управление арендами</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/bookings"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="font-medium">Все бронирования</div>
                                <div className="text-sm text-muted-foreground">Просмотр всех заказов</div>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/admin/bookings/create"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <div className="font-medium">Создать аренду</div>
                                <div className="text-sm text-muted-foreground">Новое бронирование</div>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/admin/reports"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="font-medium">Отчет по арендам</div>
                                <div className="text-sm text-muted-foreground">Аналитика и статистика</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}