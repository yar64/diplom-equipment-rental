// app/admin/bookings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
    Search, Filter, Calendar, User, Package,
    ChevronDown, MoreVertical, Eye, Edit, Trash2,
    CheckCircle, Clock, XCircle, DollarSign,
    Download, Plus
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatPrice } from '@/shared/utils'
import { getAllBookings, getBookingStats } from '@/server/actions/booking.actions'

// Типы
interface Booking {
    id: string
    status: string
    startDate: string
    endDate: string
    totalDays: number
    totalPrice: number
    eventType?: string
    eventAddress?: string
    createdAt: string
    user: {
        id: string
        name?: string
        email: string
        phone?: string
    }
    equipment: {
        id: string
        name: string
        pricePerDay: number
        category: {
            name: string
        }
    }
}

interface BookingStats {
    totalBookings: number
    pendingBookings: number
    activeBookings: number
    completedBookings: number
    totalRevenue: number
    recentBookings: Booking[]
}

// Компонент статуса
const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
        PENDING: { color: 'bg-yellow-500', text: 'Ожидает' },
        CONFIRMED: { color: 'bg-blue-500', text: 'Подтверждено' },
        ACTIVE: { color: 'bg-green-500', text: 'Активно' },
        COMPLETED: { color: 'bg-purple-500', text: 'Завершено' },
        CANCELLED: { color: 'bg-red-500', text: 'Отменено' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-500', text: status }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
            {config.text}
        </span>
    )
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [stats, setStats] = useState<BookingStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        startDate: '',
        endDate: '',
    })

    const statusOptions = [
        { value: '', label: 'Все статусы' },
        { value: 'PENDING', label: 'Ожидает' },
        { value: 'CONFIRMED', label: 'Подтверждено' },
        { value: 'ACTIVE', label: 'Активно' },
        { value: 'COMPLETED', label: 'Завершено' },
        { value: 'CANCELLED', label: 'Отменено' },
    ]

    useEffect(() => {
        loadData()
    }, [filters])

    const loadData = async () => {
        setLoading(true)
        try {
            const [bookingsResult, statsResult] = await Promise.all([
                getAllBookings({
                    status: filters.status || undefined,
                    search: filters.search || undefined,
                    startDate: filters.startDate ? new Date(filters.startDate) : undefined,
                    endDate: filters.endDate ? new Date(filters.endDate) : undefined,
                }),
                getBookingStats()
            ])

            if (bookingsResult.success) {
                setBookings(bookingsResult.data as Booking[])
            }

            if (statsResult.success) {
                setStats(statsResult.data as BookingStats)
            }
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleExport = () => {
        // Логика экспорта данных
        alert('Экспорт данных в разработке...')
    }

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопки */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Бронирования</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление всеми заказами на аренду оборудования
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Экспорт
                    </button>
                    <Link
                        href="/admin/bookings/create"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Новое бронирование
                    </Link>
                </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Всего заказов</div>
                            <div className="text-2xl font-bold mt-1">{stats?.totalBookings || 0}</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Ожидают</div>
                            <div className="text-2xl font-bold mt-1">{stats?.pendingBookings || 0}</div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Активные</div>
                            <div className="text-2xl font-bold mt-1">{stats?.activeBookings || 0}</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Выручка</div>
                            <div className="text-2xl font-bold mt-1">
                                {formatPrice(stats?.totalRevenue || 0)}
                            </div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <DollarSign className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="border border-border rounded-lg bg-background p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Поиск по клиенту, оборудованию, адресу..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            placeholder="Дата начала"
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            placeholder="Дата окончания"
                        />
                    </div>
                </div>
            </div>

            {/* Таблица бронирований */}
            <div className="border border-border rounded-lg bg-background overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-sm">ID</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Клиент</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Оборудование</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Даты</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Стоимость</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Статус</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center">
                                        <div className="animate-pulse text-muted-foreground">
                                            Загрузка бронирований...
                                        </div>
                                    </td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        Бронирования не найдены
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="text-sm font-mono">#{booking.id.slice(0, 8)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatDate(booking.createdAt)}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">
                                                        {booking.user.name || 'Без имени'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {booking.user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                                    <Package className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{booking.equipment.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {booking.equipment.category.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm">
                                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {booking.totalDays} {booking.totalDays === 1 ? 'день' : 'дней'}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-semibold">{formatPrice(booking.totalPrice)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatPrice(booking.equipment.pricePerDay)}/день
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/bookings/${booking.id}`}
                                                    className="p-1.5 hover:bg-accent rounded transition-colors"
                                                    title="Просмотр"
                                                >
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                </Link>
                                                <Link
                                                    href={`/admin/bookings/${booking.id}/edit`}
                                                    className="p-1.5 hover:bg-accent rounded transition-colors"
                                                    title="Редактировать"
                                                >
                                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                                </Link>
                                                <button
                                                    className="p-1.5 hover:bg-accent rounded transition-colors hover:text-red-500"
                                                    title="Удалить"
                                                    onClick={() => {
                                                        if (confirm('Удалить это бронирование?')) {
                                                            // Логика удаления
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Пагинация */}
                <div className="border-t border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Показано {bookings.length} записей
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 border border-input rounded text-sm hover:bg-accent transition-colors">
                                Назад
                            </button>
                            <button className="px-3 py-1 border border-input rounded text-sm bg-accent font-medium">
                                1
                            </button>
                            <button className="px-3 py-1 border border-input rounded text-sm hover:bg-accent transition-colors">
                                Далее
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}