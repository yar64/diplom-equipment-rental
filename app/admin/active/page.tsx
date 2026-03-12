'use client'

import { useState, useEffect } from 'react'
import {
    Clock, CheckCircle, XCircle, Package, User,
    Calendar, MapPin, Phone, Mail, AlertCircle,
    Filter, RefreshCw, Eye, MessageSquare, Loader2,
    ChevronLeft, ChevronRight, CalendarDays
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDate, formatPrice } from '@/shared/utils'
import {
    getAllBookings,
    updateBookingStatus,
    getBookingById
} from '@/server/actions/booking.actions'
import { useUser } from '@/hooks/useUser'
import Button from '../../components/ui/Button'

// Типы
interface ActiveBooking {
    id: string
    status: string
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

// Модальное окно подтверждения
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    isProcessing = false
}: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isProcessing?: boolean
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={confirmText === 'Завершить' ? 'default' : 'destructive'}
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="gap-2"
                    >
                        {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isProcessing ? 'Обработка...' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Модальное окно продления
const ExtendModal = ({
    isOpen,
    onClose,
    onConfirm,
    booking,
    isProcessing = false
}: {
    isOpen: boolean
    onClose: () => void
    onConfirm: (days: number) => void
    booking: ActiveBooking | null
    isProcessing?: boolean
}) => {
    const [days, setDays] = useState(1)

    if (!isOpen || !booking) return null

    const currentEndDate = new Date(booking.endDate)
    const newEndDate = new Date(currentEndDate)
    newEndDate.setDate(newEndDate.getDate() + days)

    const additionalCost = days * booking.equipment.pricePerDay
    const totalCost = booking.totalPrice + additionalCost

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-2">Продление аренды</h3>
                <p className="text-muted-foreground mb-4">
                    {booking.equipment.name}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Количество дней
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                            className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        />
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Текущая дата окончания:</span>
                            <span className="font-medium">{formatDate(booking.endDate)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Новая дата окончания:</span>
                            <span className="font-medium">{formatDate(newEndDate.toISOString())}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                            <span className="font-medium">Дополнительная стоимость:</span>
                            <span className="font-bold text-primary">{formatPrice(additionalCost)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Итоговая стоимость:</span>
                            <span className="font-bold text-primary">{formatPrice(totalCost)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Отмена
                    </Button>
                    <Button
                        onClick={() => onConfirm(days)}
                        disabled={isProcessing}
                        className="gap-2"
                    >
                        {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isProcessing ? 'Обработка...' : 'Продлить'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function ActiveRentalsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useUser()

    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([])
    const [filter, setFilter] = useState<'all' | 'today' | 'overdue'>(searchParams.get('filter') as any || 'all')

    // Состояния для модальных окон
    const [completeModal, setCompleteModal] = useState<{ isOpen: boolean; bookingId: string | null }>({
        isOpen: false,
        bookingId: null
    })
    const [extendModal, setExtendModal] = useState<{ isOpen: boolean; booking: ActiveBooking | null }>({
        isOpen: false,
        booking: null
    })

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const itemsPerPage = 10

    useEffect(() => {
        loadActiveBookings()
    }, [filter, searchParams.get('page')])

    const loadActiveBookings = async () => {
        setLoading(true)
        try {
            const page = parseInt(searchParams.get('page') || '1')

            const result = await getAllBookings({
                status: 'ACTIVE',
                page,
                limit: itemsPerPage
            })

            if (result.success && result.data) {
                setActiveBookings(result.data.items || [])
                setCurrentPage(result.data.page || 1)
                setTotalPages(result.data.totalPages || 1)
                setTotalItems(result.data.total || 0)
            }
        } catch (error) {
            console.error('Error loading active bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (newFilter: 'all' | 'today' | 'overdue') => {
        setFilter(newFilter)
        const params = new URLSearchParams(searchParams.toString())
        params.set('filter', newFilter)
        params.delete('page')
        router.push(`/admin/active?${params.toString()}`)
    }

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`/admin/active?${params.toString()}`)
    }

    const handleCompleteRental = async () => {
        if (!completeModal.bookingId || !user?.id) return

        setUpdating(completeModal.bookingId)
        try {
            const result = await updateBookingStatus(
                completeModal.bookingId,
                'COMPLETED',
                user.id
            )

            if (result.success) {
                await loadActiveBookings()
                setCompleteModal({ isOpen: false, bookingId: null })
            } else {
                alert(result.error || 'Ошибка при завершении аренды')
            }
        } catch (error) {
            console.error('Error completing rental:', error)
            alert('Ошибка при завершении аренды')
        } finally {
            setUpdating(null)
        }
    }

    const handleExtendRental = async (days: number) => {
        if (!extendModal.booking || !user?.id) return

        setUpdating(extendModal.booking.id)
        try {
            // Здесь должен быть экшен для продления
            // Пока просто меняем статус (заглушка)
            alert(`Продление аренды на ${days} дней в разработке`)
            setExtendModal({ isOpen: false, booking: null })
        } catch (error) {
            console.error('Error extending rental:', error)
            alert('Ошибка при продлении аренды')
        } finally {
            setUpdating(null)
        }
    }

    const handleContactUser = (userId: string) => {
        // Здесь можно открыть чат или показать контакты
        const booking = activeBookings.find(b => b.user.id === userId)
        if (booking?.user.phone) {
            alert(`Телефон: ${booking.user.phone}\nEmail: ${booking.user.email}`)
        } else {
            alert(`Email: ${booking?.user.email}`)
        }
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

    // Фильтрация на клиенте (поверх серверной)
    const filteredBookings = activeBookings.filter(booking => {
        const now = new Date()
        const startDate = new Date(booking.startDate)
        const endDate = new Date(booking.endDate)

        switch (filter) {
            case 'today':
                return startDate.toDateString() === now.toDateString()
            case 'overdue':
                return endDate < now
            default:
                return true
        }
    })

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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border border-border rounded-lg p-4">
                            <div className="h-8 bg-muted rounded animate-pulse"></div>
                        </div>
                    ))}
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
                    disabled={!!updating}
                >
                    <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
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
                            <CalendarDays className="w-5 h-5 text-green-500" />
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
                    onClick={() => handleFilterChange('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-input hover:bg-accent'
                        }`}
                >
                    Все ({stats.total})
                </button>
                <button
                    onClick={() => handleFilterChange('today')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'today'
                        ? 'bg-green-500 text-white'
                        : 'border border-input hover:bg-accent'
                        }`}
                >
                    Сегодня ({stats.today})
                </button>
                <button
                    onClick={() => handleFilterChange('overdue')}
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
                {filteredBookings.length === 0 ? (
                    <div className="lg:col-span-2 border border-border rounded-lg p-12 text-center">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Нет активных аренд</h3>
                        <p className="text-muted-foreground mb-6">
                            {filter === 'today'
                                ? 'На сегодня нет запланированных аренд'
                                : filter === 'overdue'
                                    ? 'Нет просроченных аренд'
                                    : 'В данный момент нет активных аренд оборудования'}
                        </p>
                        <Link
                            href="/admin/bookings/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                            Создать новую аренду
                        </Link>
                    </div>
                ) : (
                    filteredBookings.map((booking) => {
                        const daysRemaining = getDaysRemaining(booking.endDate)
                        const isOverdue = daysRemaining < 0
                        const isEndingSoon = daysRemaining >= 0 && daysRemaining <= 2
                        const isProcessing = updating === booking.id

                        return (
                            <div key={booking.id} className="border border-border rounded-lg bg-background overflow-hidden">
                                {/* Заголовок карточки */}
                                <div className={`px-6 py-4 border-b border-border ${isOverdue ? 'bg-red-500/10' :
                                        isEndingSoon ? 'bg-yellow-500/10' :
                                            'bg-green-500/10'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${getStatusColor(booking.endDate)}`} />
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
                                            onClick={() => setCompleteModal({ isOpen: true, bookingId: booking.id })}
                                            disabled={isProcessing}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4" />
                                            )}
                                            Завершить
                                        </button>
                                        <button
                                            onClick={() => setExtendModal({ isOpen: true, booking })}
                                            disabled={isProcessing}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
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

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="text-sm text-muted-foreground">
                        Показано {filteredBookings.length} из {totalItems} записей
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-input rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm">
                            {currentPage} из {totalPages}
                        </span>
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-input rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Модальные окна */}
            <ConfirmModal
                isOpen={completeModal.isOpen}
                onClose={() => setCompleteModal({ isOpen: false, bookingId: null })}
                onConfirm={handleCompleteRental}
                title="Завершение аренды"
                message="Вы уверены, что хотите завершить эту аренду? Оборудование будет помечено как доступное."
                confirmText="Завершить"
                isProcessing={!!updating}
            />

            <ExtendModal
                isOpen={extendModal.isOpen}
                onClose={() => setExtendModal({ isOpen: false, booking: null })}
                onConfirm={handleExtendRental}
                booking={extendModal.booking}
                isProcessing={!!updating}
            />

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