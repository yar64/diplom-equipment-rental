// app/admin/page.tsx
import { getEquipment } from '@/server/actions/equipment.actions'
import { getCategories } from '@/server/actions/category.actions'
import { getUsers } from '@/server/actions/user.actions'
import StatCard from '../components/admin/StatCard'
import {
    Package,
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    CheckCircle,
    Clock,
    XCircle,
    BarChart3,
    Layers,
    Activity
} from 'lucide-react'
import Link from 'next/link'

// Определяем типы для данных
interface EquipmentItem {
    id: string
    name: string
    categoryId: string
    // другие поля которые используются
}

interface CategoryItem {
    id: string
    name: string
    // другие поля которые используются
}

interface UserItem {
    id: string
    // другие поля которые используются
}

interface BookingItem {
    id: string
    equipment: string
    user: string
    status: 'подтвержден' | 'ожидает' | 'завершен' | 'отменен'
    date: string
    amount: number
}

export default async function AdminDashboard() {
    const [equipmentResult, categoriesResult, usersResult] = await Promise.all([
        getEquipment(),
        getCategories(),
        getUsers()
    ])

    // Явно указываем типы
    const equipment = equipmentResult.success
        ? (equipmentResult.data as EquipmentItem[]) || []
        : []

    const categories = categoriesResult.success
        ? (categoriesResult.data as CategoryItem[]) || []
        : []

    const users = usersResult.success
        ? (usersResult.data as UserItem[]) || []
        : []

    // Моковые данные для примеров
    const recentBookings: BookingItem[] = [
        { id: '1', equipment: 'Микшер Yamaha CL5', user: 'Иван Иванов', status: 'подтвержден', date: '2024-12-01', amount: 13500 },
        { id: '2', equipment: 'Samsung 55" QLED', user: 'Мария Петрова', status: 'ожидает', date: '2024-11-30', amount: 36000 },
        { id: '3', equipment: 'Проектор Epson EB-U50', user: 'Алексей Сидоров', status: 'завершен', date: '2024-11-28', amount: 10500 },
    ]

    const statusIcons = {
        подтвержден: <CheckCircle className="w-4 h-4 text-green-500" />,
        ожидает: <Clock className="w-4 h-4 text-yellow-500" />,
        завершен: <CheckCircle className="w-4 h-4 text-blue-500" />,
        отменен: <XCircle className="w-4 h-4 text-red-500" />,
    }

    // Вспомогательная функция для подсчета оборудования по категории
    const getEquipmentCountByCategory = (categoryId: string): number => {
        return equipment.filter((item: EquipmentItem) => item.categoryId === categoryId).length
    }

    // Вычисляем проценты для каждой категории
    const getCategoryPercentage = (categoryId: string): number => {
        const count = getEquipmentCountByCategory(categoryId)
        return equipment.length > 0 ? (count / equipment.length) * 100 : 0
    }

    return (
        <div className="space-y-8">
            {/* Заголовок */}
            <div className="animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
                <p className="text-muted-foreground mt-2">
                    Обзор вашего бизнеса по аренде оборудования
                </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
                <StatCard
                    title="Всего оборудования"
                    value={equipment.length}
                    icon={<Package className="w-5 h-5" />}
                    description="В инвентаре"
                    trend="+12"
                    delay="100"
                />
                <StatCard
                    title="Клиенты"
                    value={users.length}
                    icon={<Users className="w-5 h-5" />}
                    description="Зарегистрировано"
                    trend="+5"
                    delay="200"
                />
                <StatCard
                    title="Активные аренды"
                    value="23"
                    icon={<Calendar className="w-5 h-5" />}
                    description="На этой неделе"
                    trend="+8"
                    delay="300"
                />
                <StatCard
                    title="Месячная выручка"
                    value="124 500 ₽"
                    icon={<DollarSign className="w-5 h-5" />}
                    description="Общий доход"
                    trend="+18%"
                    delay="400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Последние бронирования */}
                <div className="lg:col-span-2 animate-slide-in" style={{ animationDelay: '200ms' }}>
                    <div className="border border-border rounded-lg bg-background">
                        <div className="px-6 py-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Последние бронирования</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Недавние заказы на аренду</p>
                                </div>
                                <Link
                                    href="/admin/bookings"
                                    className="text-sm font-medium text-foreground hover:text-primary transition-colors-smooth link-underline"
                                >
                                    Смотреть все →
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-border">
                            {recentBookings.map((booking) => (
                                <div key={booking.id} className="px-6 py-4 hover:bg-accent/50 transition-colors-smooth">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{booking.equipment}</h3>
                                            <p className="text-sm text-muted-foreground">{booking.user} • {booking.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold">{booking.amount.toLocaleString('ru-RU')} ₽</span>
                                            <div className="flex items-center gap-2">
                                                {statusIcons[booking.status]}
                                                <span className="text-sm text-muted-foreground capitalize">{booking.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Категории оборудования */}
                    <div className="mt-6 border border-border rounded-lg bg-background animate-slide-in" style={{ animationDelay: '300ms' }}>
                        <div className="px-6 py-4 border-b border-border">
                            <h2 className="text-lg font-semibold">Категории оборудования</h2>
                            <p className="text-sm text-muted-foreground mt-1">Распределение по типам</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {categories.slice(0, 4).map((category, index) => {
                                    const equipmentCount = getEquipmentCountByCategory(category.id)
                                    const percentage = getCategoryPercentage(category.id)

                                    return (
                                        <div
                                            key={category.id}
                                            className="border border-border rounded-lg p-4 hover:border-primary transition-colors-smooth hover-lift"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{category.name}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {equipmentCount} шт.
                                                </span>
                                            </div>
                                            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div className="space-y-6">
                    {/* Быстрая статистика */}
                    <div className="border border-border rounded-lg bg-background p-6 animate-scale-in" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Быстрая статистика</h2>
                                <p className="text-sm text-muted-foreground">Активность за сегодня</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Новые заказы</span>
                                <span className="font-semibold">3</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Доступное оборудование</span>
                                <span className="font-semibold">18/28</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Ожидают отзывы</span>
                                <span className="font-semibold">5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Нагрузка системы</span>
                                <span className="font-semibold">24%</span>
                            </div>
                        </div>
                    </div>

                    {/* Быстрые действия */}
                    <div className="border border-border rounded-lg bg-background animate-scale-in" style={{ animationDelay: '200ms' }}>
                        <div className="px-6 py-4 border-b border-border">
                            <h2 className="text-lg font-semibold">Быстрые действия</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            <Link
                                href="/admin/equipment/create"
                                className="flex items-center gap-3 p-3 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors-smooth"
                            >
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Package className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">Добавить оборудование</div>
                                    <div className="text-xs text-muted-foreground">Новый элемент инвентаря</div>
                                </div>
                            </Link>

                            <Link
                                href="/admin/bookings/create"
                                className="flex items-center gap-3 p-3 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors-smooth"
                            >
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Calendar className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">Создать бронирование</div>
                                    <div className="text-xs text-muted-foreground">Новый заказ на аренду</div>
                                </div>
                            </Link>

                            <Link
                                href="/admin/analytics"
                                className="flex items-center gap-3 p-3 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors-smooth"
                            >
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <BarChart3 className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">Аналитика</div>
                                    <div className="text-xs text-muted-foreground">Отчеты по эффективности</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Статус системы */}
                    <div className="border border-border rounded-lg bg-background p-6 animate-scale-in" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Статус системы</h2>
                                <p className="text-sm text-muted-foreground">Все системы работают</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">База данных</span>
                                <span className="text-sm font-medium text-green-500">В сети</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">API сервисы</span>
                                <span className="text-sm font-medium text-green-500">Активны</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Хранилище</span>
                                <span className="text-sm font-medium">64% занято</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}