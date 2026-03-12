'use client'

import { useState, useEffect } from 'react'
import {
    DollarSign, CheckCircle, Clock, XCircle, Filter,
    Download, RefreshCw, Eye, CreditCard, TrendingUp,
    AlertCircle, Users, Package, Calendar, ChevronLeft,
    ChevronRight, RotateCcw, X, FileText, User, Phone,
    Mail, Calendar as CalendarIcon
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDate, formatPrice } from '@/shared/utils'
import { getPayments, getPaymentStats, updatePaymentStatus, getPaymentById } from '@/server/actions/payment.actions'
import { useUser } from '@/hooks/useUser'
import Button from '../../components/ui/Button'

// Типы
interface Payment {
    id: string
    bookingId: string
    amount: number
    status: string
    method?: string
    transactionId?: string
    paidAt?: string
    createdAt: string
    booking: {
        id: string
        equipment: {
            name: string
        }
        user: {
            name?: string
            email: string
            phone?: string
        }
        totalPrice: number
        startDate: string
        endDate: string
    }
    confirmedBy?: {
        name: string
    }
}

interface PaymentStats {
    total: number
    paid: number
    pending: number
    failed: number
    refunded: number
    count: number
    paidCount: number
    pendingCount: number
    failedCount: number
}

// Компонент статуса
const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<string, { color: string; text: string; bg: string }> = {
        PAID: { color: 'text-green-600', bg: 'bg-green-100', text: 'Оплачен' },
        PENDING: { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Ожидает' },
        PROCESSING: { color: 'text-blue-600', bg: 'bg-blue-100', text: 'Обрабатывается' },
        FAILED: { color: 'text-red-600', bg: 'bg-red-100', text: 'Ошибка' },
        REFUNDED: { color: 'text-purple-600', bg: 'bg-purple-100', text: 'Возврат' },
        PARTIAL: { color: 'text-orange-600', bg: 'bg-orange-100', text: 'Частично' },
    }

    const config = statusConfig[status] || { color: 'text-gray-600', bg: 'bg-gray-100', text: status }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
            {config.text}
        </span>
    )
}

// Модальное окно просмотра платежа
const PaymentPreviewModal = ({
    paymentId,
    isOpen,
    onClose
}: {
    paymentId: string | null
    isOpen: boolean
    onClose: () => void
}) => {
    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (paymentId && isOpen) {
            loadPayment(paymentId)
        }
    }, [paymentId, isOpen])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
        }
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    const loadPayment = async (id: string) => {
        setLoading(true)
        try {
            const result = await getPaymentById(id)
            if (result.success && result.data) {
                setPayment(result.data as Payment)
            }
        } catch (error) {
            console.error('Error loading payment:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        Детали платежа
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
                                <RotateCcw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                                <p className="text-muted-foreground">Загрузка данных...</p>
                            </div>
                        </div>
                    ) : !payment ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Платеж не найден
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Статус и ID */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">ID платежа</div>
                                    <div className="font-mono text-sm">#{payment.id.slice(0, 8)}</div>
                                </div>
                                <StatusBadge status={payment.status} />
                            </div>

                            {/* Сумма */}
                            <div className="bg-primary/5 p-6 rounded-lg text-center">
                                <div className="text-sm text-muted-foreground mb-1">Сумма платежа</div>
                                <div className="text-4xl font-bold text-primary">
                                    {formatPrice(payment.amount)}
                                </div>
                            </div>

                            {/* Информация о платеже */}
                            <div className="border border-border rounded-lg p-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                    Информация о платеже
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Способ оплаты</div>
                                        <div className="font-medium capitalize">{payment.method || 'Не указан'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">ID транзакции</div>
                                        <div className="font-medium">{payment.transactionId || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Дата создания</div>
                                        <div className="font-medium">{formatDate(payment.createdAt)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Дата оплаты</div>
                                        <div className="font-medium">{payment.paidAt ? formatDate(payment.paidAt) : '—'}</div>
                                    </div>
                                    {payment.confirmedBy && (
                                        <div className="col-span-2">
                                            <div className="text-sm text-muted-foreground">Подтвердил</div>
                                            <div className="font-medium">{payment.confirmedBy.name}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Информация о клиенте */}
                            <div className="border border-border rounded-lg p-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Клиент
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">{payment.booking.user.name || 'Без имени'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span>{payment.booking.user.email}</span>
                                    </div>
                                    {payment.booking.user.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span>{payment.booking.user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Информация о бронировании */}
                            <div className="border border-border rounded-lg p-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary" />
                                    Бронирование
                                </h3>
                                <div className="space-y-2">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Оборудование</div>
                                        <div className="font-medium">{payment.booking.equipment.name}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <div className="text-sm text-muted-foreground">Дата начала</div>
                                            <div className="font-medium">{formatDate(payment.booking.startDate)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Дата окончания</div>
                                            <div className="font-medium">{formatDate(payment.booking.endDate)}</div>
                                        </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-border">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Стоимость заказа:</span>
                                            <span className="font-medium">{formatPrice(payment.booking.totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Подвал */}
                <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
                    <Link href={`/admin/bookings/${payment?.bookingId}`}>
                        <Button variant="outline">
                            Перейти к заказу
                        </Button>
                    </Link>
                    <Button variant="primary" onClick={onClose}>
                        Закрыть
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Модальное окно подтверждения оплаты
const ConfirmPaymentModal = ({
    isOpen,
    onClose,
    onConfirm,
    payment,
    isProcessing = false
}: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    payment: Payment | null
    isProcessing?: boolean
}) => {
    if (!isOpen || !payment) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-2">Подтверждение оплаты</h3>
                <p className="text-muted-foreground mb-4">
                    Вы уверены, что хотите отметить платеж как оплаченный?
                </p>

                <div className="bg-muted/30 p-4 rounded-lg space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Сумма:</span>
                        <span className="font-bold text-primary">{formatPrice(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Клиент:</span>
                        <span>{payment.booking.user.name || 'Без имени'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Оборудование:</span>
                        <span>{payment.booking.equipment.name}</span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Отмена
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="gap-2"
                    >
                        {isProcessing && <RotateCcw className="w-4 h-4 animate-spin" />}
                        {isProcessing ? 'Обработка...' : 'Подтвердить оплату'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function PaymentsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useUser()

    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [payments, setPayments] = useState<Payment[]>([])
    const [stats, setStats] = useState<PaymentStats | null>(null)
    const [filter, setFilter] = useState<string>(searchParams.get('status') || 'all')
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>(searchParams.get('range') as any || 'month')
    const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; paymentId: string | null }>({
        isOpen: false,
        paymentId: null
    })
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; payment: Payment | null }>({
        isOpen: false,
        payment: null
    })

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const itemsPerPage = 25

    useEffect(() => {
        loadData()
    }, [filter, timeRange, searchParams.get('page')])

    const loadData = async () => {
        setLoading(true)
        try {
            const page = parseInt(searchParams.get('page') || '1')

            // Вычисляем даты для фильтрации
            const now = new Date()
            const startDate = new Date()
            if (timeRange === 'week') {
                startDate.setDate(now.getDate() - 7)
            } else if (timeRange === 'month') {
                startDate.setMonth(now.getMonth() - 1)
            } else if (timeRange === 'year') {
                startDate.setFullYear(now.getFullYear() - 1)
            }

            const [paymentsResult, statsResult] = await Promise.all([
                getPayments({
                    status: filter !== 'all' ? filter : undefined,
                    startDate,
                    endDate: now,
                    page,
                    limit: itemsPerPage
                }),
                getPaymentStats({ startDate, endDate: now })
            ])

            if (paymentsResult.success && paymentsResult.data) {
                setPayments(paymentsResult.data.items || [])
                setCurrentPage(paymentsResult.data.page || 1)
                setTotalPages(paymentsResult.data.totalPages || 1)
                setTotalItems(paymentsResult.data.total || 0)
            }

            if (statsResult.success) {
                setStats(statsResult.data as PaymentStats)
            }
        } catch (error) {
            console.error('Error loading payments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter)
        const params = new URLSearchParams(searchParams.toString())
        params.set('status', newFilter)
        params.delete('page')
        router.push(`/admin/payments?${params.toString()}`)
    }

    const handleTimeRangeChange = (newRange: 'week' | 'month' | 'year') => {
        setTimeRange(newRange)
        const params = new URLSearchParams(searchParams.toString())
        params.set('range', newRange)
        params.delete('page')
        router.push(`/admin/payments?${params.toString()}`)
    }

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`/admin/payments?${params.toString()}`)
    }

    const handleConfirmPayment = async () => {
        if (!confirmModal.payment || !user?.id) return

        setUpdating(confirmModal.payment.id)
        try {
            const result = await updatePaymentStatus(
                confirmModal.payment.id,
                'PAID',
                user.id
            )

            if (result.success) {
                await loadData()
                setConfirmModal({ isOpen: false, payment: null })
            } else {
                alert(result.error || 'Ошибка при подтверждении платежа')
            }
        } catch (error) {
            console.error('Error confirming payment:', error)
            alert('Ошибка при подтверждении платежа')
        } finally {
            setUpdating(null)
        }
    }

    const handleExport = async () => {
        alert('Экспорт платежей в разработке...')
    }

    const getMethodIcon = (method?: string) => {
        switch (method?.toLowerCase()) {
            case 'card':
            case 'карта':
                return { icon: CreditCard, color: 'text-blue-500' }
            case 'cash':
            case 'наличные':
                return { icon: DollarSign, color: 'text-green-500' }
            case 'transfer':
            case 'перевод':
                return { icon: TrendingUp, color: 'text-purple-500' }
            default:
                return { icon: CreditCard, color: 'text-gray-500' }
        }
    }

    if (loading && !payments.length) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Платежи</h1>
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
            {/* Заголовок */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Платежи</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление финансовыми операциями и оплатами
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Обновить
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Экспорт
                    </button>
                </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Общая сумма</div>
                            <div className="text-2xl font-bold mt-1">{formatPrice(stats?.total || 0)}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stats?.count || 0} платежей</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <DollarSign className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Оплачено</div>
                            <div className="text-2xl font-bold mt-1">{formatPrice(stats?.paid || 0)}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stats?.paidCount || 0} платежей</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Ожидает оплаты</div>
                            <div className="text-2xl font-bold mt-1">{formatPrice(stats?.pending || 0)}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stats?.pendingCount || 0} платежей</div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Неудачные</div>
                            <div className="text-2xl font-bold mt-1">{formatPrice(stats?.failed || 0)}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stats?.failedCount || 0} платежей</div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Возвраты</div>
                            <div className="text-2xl font-bold mt-1">{formatPrice(stats?.refunded || 0)}</div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <RotateCcw className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="border border-border rounded-lg bg-background p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-input hover:bg-accent'
                                    }`}
                            >
                                Все
                            </button>
                            <button
                                onClick={() => handleFilterChange('PAID')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'PAID'
                                    ? 'bg-green-500 text-white'
                                    : 'border border-input hover:bg-accent'
                                    }`}
                            >
                                Оплаченные
                            </button>
                            <button
                                onClick={() => handleFilterChange('PENDING')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'PENDING'
                                    ? 'bg-yellow-500 text-white'
                                    : 'border border-input hover:bg-accent'
                                    }`}
                            >
                                Ожидают
                            </button>
                            <button
                                onClick={() => handleFilterChange('FAILED')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'FAILED'
                                    ? 'bg-red-500 text-white'
                                    : 'border border-input hover:bg-accent'
                                    }`}
                            >
                                Ошибки
                            </button>
                            <button
                                onClick={() => handleFilterChange('REFUNDED')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'REFUNDED'
                                    ? 'bg-purple-500 text-white'
                                    : 'border border-input hover:bg-accent'
                                    }`}
                            >
                                Возвраты
                            </button>
                        </div>
                    </div>
                    <div>
                        <select
                            value={timeRange}
                            onChange={(e) => handleTimeRangeChange(e.target.value as any)}
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        >
                            <option value="week">За неделю</option>
                            <option value="month">За месяц</option>
                            <option value="year">За год</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Таблица платежей */}
            <div className="border border-border rounded-lg bg-background overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-sm">ID</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Оборудование</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Клиент</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Сумма</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Способ</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Статус</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Дата</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                                        <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-lg font-medium">Платежи не найдены</p>
                                        <p className="text-sm mt-1">Попробуйте изменить параметры фильтрации</p>
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => {
                                    const methodIcon = getMethodIcon(payment.method)
                                    const MethodIcon = methodIcon.icon
                                    const isProcessing = updating === payment.id

                                    return (
                                        <tr key={payment.id} className="hover:bg-accent/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-mono text-sm">#{payment.id.slice(0, 8)}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Заказ: #{payment.bookingId.slice(0, 8)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{payment.booking.equipment.name}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Сумма заказа: {formatPrice(payment.booking.totalPrice)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <Users className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">
                                                            {payment.booking.user.name || 'Без имени'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {payment.booking.user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold">{formatPrice(payment.amount)}</div>
                                                {payment.transactionId && (
                                                    <div className="text-xs text-muted-foreground">
                                                        ID: {payment.transactionId.slice(0, 10)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <MethodIcon className={`w-4 h-4 ${methodIcon.color}`} />
                                                    <span className="text-sm capitalize">{payment.method || 'Не указан'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <StatusBadge status={payment.status} />
                                                {payment.confirmedBy && payment.status === 'PAID' && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Подтвердил: {payment.confirmedBy.name}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                                    {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    {payment.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => setConfirmModal({ isOpen: true, payment })}
                                                            disabled={isProcessing}
                                                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {isProcessing ? '...' : 'Подтвердить'}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setPreviewModal({ isOpen: true, paymentId: payment.id })}
                                                        className="p-1.5 border border-input rounded hover:bg-accent transition-colors"
                                                        title="Просмотр платежа"
                                                    >
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                    <Link
                                                        href={`/admin/bookings/${payment.bookingId}`}
                                                        className="p-1.5 border border-input rounded hover:bg-accent transition-colors"
                                                        title="Просмотр заказа"
                                                    >
                                                        <Package className="w-4 h-4 text-muted-foreground" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Пагинация */}
                {totalPages > 1 && (
                    <div className="border-t border-border px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Показано {payments.length} из {totalItems} записей
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-input rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-4 h-4" />
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
                                    className="p-2 border border-input rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Модальное окно просмотра */}
            <PaymentPreviewModal
                paymentId={previewModal.paymentId}
                isOpen={previewModal.isOpen}
                onClose={() => setPreviewModal({ isOpen: false, paymentId: null })}
            />

            {/* Модальное окно подтверждения */}
            <ConfirmPaymentModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, payment: null })}
                onConfirm={handleConfirmPayment}
                payment={confirmModal.payment}
                isProcessing={updating === confirmModal.payment?.id}
            />

            {/* Быстрые действия */}
            <div className="border border-border rounded-lg bg-background p-6">
                <h2 className="text-lg font-semibold mb-4">Финансовые операции</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/reports/financial"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="font-medium">Финансовый отчет</div>
                                <div className="text-sm text-muted-foreground">Доходы и расходы</div>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/admin/bookings"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <div className="font-medium">Все заказы</div>
                                <div className="text-sm text-muted-foreground">Просмотр всех бронирований</div>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/admin/settings/payments"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <CreditCard className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="font-medium">Настройки платежей</div>
                                <div className="text-sm text-muted-foreground">Способы оплаты</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}