'use client'

import { useState, useEffect } from 'react'
import {
    Search, Calendar, User, Package,
    Eye, Edit, Trash2, Loader2, X,
    CheckCircle, Clock, XCircle, DollarSign,
    Download, Plus, MapPin, Users, FileText
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDate, formatPrice } from '@/shared/utils'
import {
    getAllBookings,
    getBookingStats,
    deleteBooking,
    updateBookingStatus,
    getBookingById
} from '@/server/actions/booking.actions'
import { useUser } from '@/hooks/useUser'
import Button from '../../components/ui/Button'

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
    eventDate?: string
    attendeesCount?: number
    notes?: string
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
}

// Компонент статуса
const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<string, { color: string; text: string; bg: string }> = {
        PENDING: { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Ожидает' },
        CONFIRMED: { color: 'text-blue-600', bg: 'bg-blue-100', text: 'Подтверждено' },
        ACTIVE: { color: 'text-green-600', bg: 'bg-green-100', text: 'Активно' },
        COMPLETED: { color: 'text-purple-600', bg: 'bg-purple-100', text: 'Завершено' },
        CANCELLED: { color: 'text-red-600', bg: 'bg-red-100', text: 'Отменено' },
    }

    const config = statusConfig[status] || { color: 'text-gray-600', bg: 'bg-gray-100', text: status }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
            {config.text}
        </span>
    )
}

// Модальное окно просмотра бронирования
const BookingPreviewModal = ({
    bookingId,
    isOpen,
    onClose
}: {
    bookingId: string | null
    isOpen: boolean
    onClose: () => void
}) => {
    const [booking, setBooking] = useState<Booking | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (bookingId && isOpen) {
            loadBooking(bookingId)
        }
    }, [bookingId, isOpen])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
        }
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    const loadBooking = async (id: string) => {
        setLoading(true)
        try {
            const result = await getBookingById(id)
            if (result.success && result.data) {
                setBooking(result.data as Booking)
            }
        } catch (error) {
            console.error('Error loading booking:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Детали бронирования
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Контент */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-pulse text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                                <p className="text-muted-foreground">Загрузка данных...</p>
                            </div>
                        </div>
                    ) : !booking ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Бронирование не найдено
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Статус и ID */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">ID бронирования</div>
                                    <div className="font-mono text-sm">#{booking.id}</div>
                                </div>
                                <StatusBadge status={booking.status} />
                            </div>

                            {/* Информация о клиенте */}
                            <div className="border border-border rounded-lg p-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Клиент
                                </h3>
                                <div className="space-y-2">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Имя</div>
                                        <div className="font-medium">{booking.user.name || 'Не указано'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Email</div>
                                        <div className="font-medium">{booking.user.email}</div>
                                    </div>
                                    {booking.user.phone && (
                                        <div>
                                            <div className="text-sm text-muted-foreground">Телефон</div>
                                            <div className="font-medium">{booking.user.phone}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Информация об оборудовании */}
                            <div className="border border-border rounded-lg p-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary" />
                                    Оборудование
                                </h3>
                                <div className="space-y-2">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Название</div>
                                        <div className="font-medium">{booking.equipment.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Категория</div>
                                        <div className="font-medium">{booking.equipment.category.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Цена за день</div>
                                        <div className="font-medium">{formatPrice(booking.equipment.pricePerDay)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Период аренды */}
                            <div className="border border-border rounded-lg p-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Период аренды
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Дата начала</div>
                                        <div className="font-medium">{formatDate(booking.startDate)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Дата окончания</div>
                                        <div className="font-medium">{formatDate(booking.endDate)}</div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {booking.totalDays} {booking.totalDays === 1 ? 'день' : 'дней'}
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                            {formatPrice(booking.totalPrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Информация о мероприятии */}
                            {(booking.eventType || booking.eventAddress || booking.eventDate || booking.attendeesCount) && (
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        Детали мероприятия
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {booking.eventType && (
                                            <div>
                                                <div className="text-sm text-muted-foreground">Тип</div>
                                                <div className="font-medium">{booking.eventType}</div>
                                            </div>
                                        )}
                                        {booking.eventAddress && (
                                            <div>
                                                <div className="text-sm text-muted-foreground">Адрес</div>
                                                <div className="font-medium">{booking.eventAddress}</div>
                                            </div>
                                        )}
                                        {booking.eventDate && (
                                            <div>
                                                <div className="text-sm text-muted-foreground">Дата мероприятия</div>
                                                <div className="font-medium">{formatDate(booking.eventDate)}</div>
                                            </div>
                                        )}
                                        {booking.attendeesCount && (
                                            <div>
                                                <div className="text-sm text-muted-foreground">Участников</div>
                                                <div className="font-medium">{booking.attendeesCount}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Примечания */}
                            {booking.notes && (
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Примечания
                                    </h3>
                                    <p className="text-sm whitespace-pre-line">{booking.notes}</p>
                                </div>
                            )}

                            {/* Дата создания */}
                            <div className="text-xs text-muted-foreground text-right">
                                Создано: {formatDate(booking.createdAt)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Подвал */}
                <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Закрыть
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function BookingsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useUser()

    const [bookings, setBookings] = useState<Booking[]>([])
    const [stats, setStats] = useState<BookingStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
        open: false,
        id: '',
        name: ''
    })
    const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; bookingId: string | null }>({
        isOpen: false,
        bookingId: null
    })
    const [statusDialog, setStatusDialog] = useState<{ open: boolean; status: string }>({
        open: false,
        status: ''
    })

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const itemsPerPage = 25

    // Фильтры из URL
    const [filters, setFilters] = useState({
        status: searchParams.get('status') || '',
        search: searchParams.get('search') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
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
    }, [searchParams])

    const loadData = async () => {
        setLoading(true)
        try {
            const page = parseInt(searchParams.get('page') || '1')

            const [bookingsResult, statsResult] = await Promise.all([
                getAllBookings({
                    status: filters.status || undefined,
                    search: filters.search || undefined,
                    startDate: filters.startDate ? new Date(filters.startDate) : undefined,
                    endDate: filters.endDate ? new Date(filters.endDate) : undefined,
                    page,
                    limit: itemsPerPage
                }),
                getBookingStats()
            ])

            if (bookingsResult.success && bookingsResult.data) {
                setBookings(bookingsResult.data.items || [])
                setCurrentPage(bookingsResult.data.page || 1)
                setTotalPages(bookingsResult.data.totalPages || 1)
                setTotalItems(bookingsResult.data.total || 0)
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

        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.delete('page')
        router.push(`/admin/bookings?${params.toString()}`)
    }

    const clearFilters = () => {
        router.push('/admin/bookings')
    }

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`/admin/bookings?${params.toString()}`)
    }

    const handleDelete = async () => {
        setUpdating(deleteDialog.id)
        try {
            const result = await deleteBooking(deleteDialog.id)
            if (result.success) {
                await loadData()
                setDeleteDialog({ open: false, id: '', name: '' })
            } else {
                alert(result.error || 'Ошибка при удалении')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Ошибка при удалении')
        } finally {
            setUpdating(null)
        }
    }

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        if (!user?.id) {
            alert('Необходима авторизация')
            return
        }

        setUpdating(bookingId)
        try {
            const result = await updateBookingStatus(bookingId, newStatus, user.id)
            if (result.success) {
                await loadData()
            } else {
                alert(result.error || 'Ошибка при изменении статуса')
            }
        } catch (error) {
            console.error('Status change error:', error)
            alert('Ошибка при изменении статуса')
        } finally {
            setUpdating(null)
        }
    }

    const handleExport = () => {
        alert('Экспорт данных в разработке...')
    }

    if (loading && !bookings.length) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Бронирования</h1>
                        <div className="h-4 w-64 bg-muted rounded animate-pulse mt-1"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
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
            {/* Заголовок и кнопки */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Бронирования</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление всеми заказами на аренду оборудования
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedItems.length > 0 && (
                        <>
                            <select
                                className="border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setStatusDialog({ open: true, status: e.target.value })
                                    }
                                }}
                                value=""
                            >
                                <option value="">Изменить статус</option>
                                {statusOptions.filter(opt => opt.value).map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => alert('Массовое удаление будет добавлено позже')}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Удалить ({selectedItems.length})
                            </Button>
                        </>
                    )}
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                            <div className="text-sm text-muted-foreground">Завершено</div>
                            <div className="text-2xl font-bold mt-1">{stats?.completedBookings || 0}</div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-purple-500" />
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
                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="border border-border rounded-lg bg-background p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                    <div className="flex items-center gap-2">
                        {(filters.search || filters.status || filters.startDate || filters.endDate) && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2 border border-input rounded-lg hover:bg-accent text-sm whitespace-nowrap"
                            >
                                Сбросить
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Таблица бронирований */}
            <div className="border border-border rounded-lg bg-background overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="w-8 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === bookings.length && bookings.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedItems(bookings.map(b => b.id))
                                            } else {
                                                setSelectedItems([])
                                            }
                                        }}
                                        className="rounded border-input"
                                    />
                                </th>
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
                                    <td colSpan={8} className="py-8 text-center">
                                        <div className="animate-pulse text-muted-foreground">
                                            Загрузка бронирований...
                                        </div>
                                    </td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-lg font-medium">Бронирования не найдены</p>
                                        <p className="text-sm mt-1">Попробуйте изменить параметры фильтрации</p>
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(booking.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedItems([...selectedItems, booking.id])
                                                    } else {
                                                        setSelectedItems(selectedItems.filter(id => id !== booking.id))
                                                    }
                                                }}
                                                className="rounded border-input"
                                            />
                                        </td>
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
                                            <div className="flex items-center gap-2">
                                                <StatusBadge status={booking.status} />
                                                <select
                                                    value=""
                                                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                    className="text-xs border border-input rounded px-1 py-0.5 bg-transparent hover:bg-accent"
                                                    disabled={updating === booking.id}
                                                >
                                                    <option value="">Сменить</option>
                                                    {statusOptions.filter(opt => opt.value && opt.value !== booking.status).map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setPreviewModal({ isOpen: true, bookingId: booking.id })}
                                                    className="p-1.5 hover:bg-accent rounded-md transition-colors"
                                                    title="Просмотр"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/admin/bookings/${booking.id}/edit`}
                                                    className="p-1.5 hover:bg-accent rounded-md transition-colors"
                                                    title="Редактировать"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteDialog({
                                                        open: true,
                                                        id: booking.id,
                                                        name: `#${booking.id.slice(0, 8)}`
                                                    })}
                                                    className="p-1.5 hover:bg-accent rounded-md transition-colors hover:text-red-500"
                                                    title="Удалить"
                                                    disabled={updating === booking.id}
                                                >
                                                    {updating === booking.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
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
                {totalPages > 1 && (
                    <div className="border-t border-border px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Показано {bookings.length} из {totalItems} записей
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-input rounded text-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Назад
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum = currentPage
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = currentPage - 2 + i
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`w-8 h-8 border border-input rounded text-sm hover:bg-accent transition-colors ${currentPage === pageNum ? 'bg-accent font-medium' : ''
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}
                                </div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-input rounded text-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Далее
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Модальное окно просмотра */}
            <BookingPreviewModal
                bookingId={previewModal.bookingId}
                isOpen={previewModal.isOpen}
                onClose={() => setPreviewModal({ isOpen: false, bookingId: null })}
            />

            {/* Диалог подтверждения удаления */}
            {deleteDialog.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-2">Подтверждение удаления</h3>
                        <p className="text-muted-foreground mb-6">
                            Вы уверены, что хотите удалить бронирование {deleteDialog.name}?
                            Это действие нельзя отменить.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialog({ open: false, id: '', name: '' })}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={updating === deleteDialog.id}
                            >
                                {updating === deleteDialog.id ? 'Удаление...' : 'Удалить'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Диалог массового изменения статуса */}
            {statusDialog.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-2">Массовое изменение статуса</h3>
                        <p className="text-muted-foreground mb-4">
                            Вы уверены, что хотите изменить статус для {selectedItems.length} бронирований на "{statusOptions.find(opt => opt.value === statusDialog.status)?.label}"?
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setStatusDialog({ open: false, status: '' })}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    // Здесь будет логика массового обновления
                                    setStatusDialog({ open: false, status: '' })
                                }}
                            >
                                Подтвердить
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}