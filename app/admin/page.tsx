// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
    Package, Users, Calendar, DollarSign, TrendingUp,
    CheckCircle, Clock, XCircle, BarChart3, Layers,
    Activity, ShoppingBag, TrendingDown, Eye, Star,
    Download, Filter, ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import StatCard from '../components/admin/StatCard'
import {
    getEquipment,
    getCategories,
    getUsers,
    getAllBookings
} from '@/server/actions'

// Типы
interface EquipmentItem {
    id: string
    name: string
    categoryId: string
    pricePerDay: number
    available: boolean
    quantity: number
    rating?: number
}

interface CategoryItem {
    id: string
    name: string
}

interface UserItem {
    id: string
    email: string
    name?: string
    role: string
    createdAt: string
}

interface BookingItem {
    id: string
    equipment: {
        id: string
        name: string;
        category: {
            name: string
        }
    }
    user: {
        name?: string
    }
    status: string
    totalPrice: number
    startDate: string
    endDate: string
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview')
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        equipment: [] as EquipmentItem[],
        categories: [] as CategoryItem[],
        users: [] as UserItem[],
        bookings: [] as BookingItem[],
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [equipmentResult, categoriesResult, usersResult, bookingsResult] = await Promise.all([
                getEquipment(),
                getCategories(),
                getUsers(),
                getAllBookings ? getAllBookings() : Promise.resolve({ success: true, data: [] })
            ])

            setStats({
                equipment: equipmentResult.success ? (equipmentResult.data as EquipmentItem[]) || [] : [],
                categories: categoriesResult.success ? (categoriesResult.data as CategoryItem[]) || [] : [],
                users: usersResult.success ? (usersResult.data as UserItem[]) || [] : [],
                bookings: bookingsResult.success ? (bookingsResult.data as BookingItem[]) || [] : [],
            })
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    // Расчеты для аналитики
    const calculateRevenue = () => {
        const completedBookings = stats.bookings.filter(b => b.status === 'COMPLETED')
        return completedBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    }

    const calculateAverageOrderValue = () => {
        if (stats.bookings.length === 0) return 0
        const total = stats.bookings.reduce((sum, b) => sum + b.totalPrice, 0)
        return total / stats.bookings.length
    }

    const getCategoryStats = () => {
        return stats.categories.map(category => {
            const equipmentInCategory = stats.equipment.filter(e => e.categoryId === category.id)
            const bookingsInCategory = stats.bookings.filter(b => {
                const eq = stats.equipment.find(e => e.id === b.equipment.id)
                return eq?.categoryId === category.id
            })
            const revenue = bookingsInCategory.reduce((sum, b) => sum + b.totalPrice, 0)

            return {
                name: category.name,
                equipmentCount: equipmentInCategory.length,
                bookingCount: bookingsInCategory.length,
                revenue,
                percentage: stats.equipment.length > 0
                    ? (equipmentInCategory.length / stats.equipment.length) * 100
                    : 0
            }
        }).sort((a, b) => b.revenue - a.revenue)
    }

    const getRecentBookings = () => {
        return [...stats.bookings]
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .slice(0, 5)
    }

    const getPopularEquipment = () => {
        return [...stats.equipment]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-500" />
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4 text-blue-500" />
            case 'CANCELLED':
                return <XCircle className="w-4 h-4 text-red-500" />
            default:
                return <Clock className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'ожидает'
            case 'CONFIRMED': return 'подтвержден'
            case 'ACTIVE': return 'активно'
            case 'COMPLETED': return 'завершен'
            case 'CANCELLED': return 'отменен'
            default: return status
        }
    }

    const revenue = calculateRevenue()
    const avgOrderValue = calculateAverageOrderValue()
    const categoryStats = getCategoryStats()
    const recentBookings = getRecentBookings()
    const popularEquipment = getPopularEquipment()

    return (
        <div className="space-y-6">
            {/* Заголовок и табы */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Панель управления</h1>
                    <p className="text-muted-foreground mt-1">
                        Обзор бизнеса и аналитика аренды оборудования
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex border border-input rounded-lg">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'overview'
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Обзор
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'analytics'
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Аналитика
                        </button>
                    </div>

                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    >
                        <option value="week">За неделю</option>
                        <option value="month">За месяц</option>
                        <option value="year">За год</option>
                    </select>

                    <button className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Отчет</span>
                    </button>
                </div>
            </div>

            {/* Основные показатели */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Общая выручка"
                    value={`${revenue.toLocaleString('ru-RU')} ₽`}
                    icon={<DollarSign className="w-5 h-5" />}
                    description={`За ${timeRange === 'week' ? 'неделю' : timeRange === 'month' ? 'месяц' : 'год'}`}
                    trend="+18%"
                    delay="100"
                />
                <StatCard
                    title="Всего заказов"
                    value={stats.bookings.length}
                    icon={<ShoppingBag className="w-5 h-5" />}
                    description="Бронирований"
                    trend="+12"
                    delay="200"
                />
                <StatCard
                    title="Средний чек"
                    value={`${Math.round(avgOrderValue).toLocaleString('ru-RU')} ₽`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    description="Средняя стоимость заказа"
                    trend="+5%"
                    delay="300"
                />
                <StatCard
                    title="Конверсия"
                    value="24%"
                    icon={<TrendingUp className="w-5 h-5" />}
                    description="Посещения → бронирования"
                    trend="+2%"
                    delay="400"
                />
            </div>

            {activeTab === 'overview' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Левая колонка */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* График доходов */}
                        <div className="border border-border rounded-lg bg-background p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-semibold">Динамика доходов</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Доход по месяцам за последний год
                                    </p>
                                </div>
                                <Filter className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="h-64 flex items-end justify-between gap-2">
                                {[65, 80, 45, 60, 75, 90, 55, 70, 85, 50, 65, 80].map((height, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg"
                                            style={{ height: `${height}%` }}
                                        />
                                        <div className="text-xs text-muted-foreground mt-2">
                                            {['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][index]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Категории оборудования */}
                        <div className="border border-border rounded-lg bg-background">
                            <div className="px-6 py-4 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Эффективность категорий</h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Доход и активность по категориям
                                        </p>
                                    </div>
                                    <Link
                                        href="/admin/categories"
                                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                    >
                                        Смотреть все →
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {categoryStats.slice(0, 4).map((category, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">{category.revenue.toLocaleString('ru-RU')} ₽</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {category.bookingCount} заказов
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full transition-all duration-500"
                                                    style={{ width: `${category.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка */}
                    <div className="space-y-6">
                        {/* Топ оборудование */}
                        <div className="border border-border rounded-lg bg-background p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Star className="w-5 h-5 text-primary" />
                                <div>
                                    <h2 className="text-lg font-semibold">Популярное оборудование</h2>
                                    <p className="text-sm text-muted-foreground">По рейтингу и спросу</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {popularEquipment.map((item, index) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <span className="text-xs font-bold text-primary">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm line-clamp-1">{item.name}</div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Star className="w-3 h-3" />
                                                    <span>{item.rating?.toFixed(1) || 'Нет оценки'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-sm">
                                                {item.pricePerDay.toLocaleString('ru-RU')} ₽/день
                                            </div>
                                            <div className={`text-xs ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                                                {item.available ? 'Доступно' : 'Занято'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Быстрые действия */}
                        <div className="border border-border rounded-lg bg-background">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-lg font-semibold">Быстрые действия</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <Link
                                    href="/admin/equipment/create"
                                    className="flex items-center gap-3 p-3 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                                >
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Package className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">Добавить оборудование</div>
                                        <div className="text-xs text-muted-foreground">Новый элемент инвентаря</div>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/bookings/create"
                                    className="flex items-center gap-3 p-3 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                                >
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <Calendar className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">Создать бронирование</div>
                                        <div className="text-xs text-muted-foreground">Новый заказ на аренду</div>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/reports"
                                    className="flex items-center gap-3 p-3 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                                >
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <BarChart3 className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">Создать отчет</div>
                                        <div className="text-xs text-muted-foreground">Генерация аналитики</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-border rounded-lg bg-background p-6">
                        <h2 className="text-lg font-semibold mb-4">Статистика бронирований</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>Подтвержденные</span>
                                </div>
                                <span className="font-semibold">
                                    {stats.bookings.filter(b => b.status === 'CONFIRMED').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span>Активные</span>
                                </div>
                                <span className="font-semibold">
                                    {stats.bookings.filter(b => b.status === 'ACTIVE').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span>Ожидают</span>
                                </div>
                                <span className="font-semibold">
                                    {stats.bookings.filter(b => b.status === 'PENDING').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <span>Завершенные</span>
                                </div>
                                <span className="font-semibold">
                                    {stats.bookings.filter(b => b.status === 'COMPLETED').length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-lg bg-background p-6">
                        <h2 className="text-lg font-semibold mb-4">Активность пользователей</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Новые пользователи</span>
                                <span className="font-semibold">
                                    {stats.users.filter(u =>
                                        new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                    ).length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Активные клиенты</span>
                                <span className="font-semibold">
                                    {stats.users.filter(u => u.role === 'CUSTOMER').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Средний чек клиента</span>
                                <span className="font-semibold">
                                    {Math.round(avgOrderValue).toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-lg bg-background p-6">
                        <h2 className="text-lg font-semibold mb-4">Загрузка оборудования</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Всего оборудования</span>
                                <span className="font-semibold">{stats.equipment.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Доступно сейчас</span>
                                <span className="font-semibold">
                                    {stats.equipment.filter(e => e.available).length} / {stats.equipment.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Средняя загрузка</span>
                                <span className="font-semibold">
                                    {Math.round((stats.bookings.length / stats.equipment.length) * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-lg bg-background p-6">
                        <h2 className="text-lg font-semibold mb-4">Финансовые показатели</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Общая выручка</span>
                                <span className="font-semibold">{revenue.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Средний чек</span>
                                <span className="font-semibold">
                                    {Math.round(avgOrderValue).toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Конверсия</span>
                                <span className="font-semibold">24%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Последние бронирования */}
            <div className="border border-border rounded-lg bg-background">
                <div className="px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Последние бронирования</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Недавние заказы на аренду
                            </p>
                        </div>
                        <Link
                            href="/admin/bookings"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Смотреть все →
                        </Link>
                    </div>
                </div>
                <div className="divide-y divide-border">
                    {recentBookings.map((booking) => (
                        <div key={booking.id} className="px-6 py-4 hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">{booking.equipment.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {booking.user.name || 'Без имени'} • {new Date(booking.startDate).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold">
                                        {booking.totalPrice.toLocaleString('ru-RU')} ₽
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(booking.status)}
                                        <span className="text-sm text-muted-foreground capitalize">
                                            {getStatusText(booking.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}