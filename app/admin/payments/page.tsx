// app/admin/payments/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
    DollarSign, CheckCircle, Clock, XCircle, Filter,
    Download, RefreshCw, Eye, CreditCard, TrendingUp,
    AlertCircle, Users, Package, Calendar
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatPrice } from '@/shared/utils'
import { getAllBookings } from '@/server/actions/booking.actions'

// Типы
interface Payment {
    id: string
    bookingId: string
    amount: number
    status: string
    method?: string
    paymentDate?: string
    createdAt: string
    booking: {
        id: string
        equipment: {
            name: string
        }
        user: {
            name?: string
            email: string
        }
        totalPrice: number
    }
}

// Моковые данные для платежей (в реальном приложении будет отдельная таблица)
const mockPayments: Payment[] = [
    {
        id: 'PAY-001',
        bookingId: 'BK-001',
        amount: 13500,
        status: 'PAID',
        method: 'Карта',
        paymentDate: '2024-12-01T10:30:00Z',
        createdAt: '2024-12-01T10:30:00Z',
        booking: {
            id: 'BK-001',
            equipment: { name: 'Микшер Yamaha CL5' },
            user: { name: 'Иван Иванов', email: 'ivan@example.com' },
            totalPrice: 13500
        }
    },
    {
        id: 'PAY-002',
        bookingId: 'BK-002',
        amount: 36000,
        status: 'PENDING',
        method: 'Наличные',
        createdAt: '2024-11-30T14:20:00Z',
        booking: {
            id: 'BK-002',
            equipment: { name: 'Samsung 55" QLED' },
            user: { name: 'Мария Петрова', email: 'maria@example.com' },
            totalPrice: 36000
        }
    },
    {
        id: 'PAY-003',
        bookingId: 'BK-003',
        amount: 10500,
        status: 'FAILED',
        method: 'Карта',
        createdAt: '2024-11-28T09:15:00Z',
        booking: {
            id: 'BK-003',
            equipment: { name: 'Проектор Epson EB-U50' },
            user: { name: 'Алексей Сидоров', email: 'alex@example.com' },
            totalPrice: 10500
        }
    },
    {
        id: 'PAY-004',
        bookingId: 'BK-004',
        amount: 22500,
        status: 'PAID',
        method: 'Перевод',
        paymentDate: '2024-11-27T16:45:00Z',
        createdAt: '2024-11-27T16:45:00Z',
        booking: {
            id: 'BK-004',
            equipment: { name: 'Акустическая система JBL' },
            user: { name: 'Ольга Козлова', email: 'olga@example.com' },
            totalPrice: 22500
        }
    },
    {
        id: 'PAY-005',
        bookingId: 'BK-005',
        amount: 18000,
        status: 'PENDING',
        method: 'Карта',
        createdAt: '2024-11-26T11:20:00Z',
        booking: {
            id: 'BK-005',
            equipment: { name: 'Светодиодный экван P3' },
            user: { email: 'client@example.com' },
            totalPrice: 18000
        }
    }
]

export default function PaymentsPage() {
    const [loading, setLoading] = useState(true)
    const [payments, setPayments] = useState<Payment[]>([])
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all')
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

    useEffect(() => {
        loadPayments()
    }, [filter, timeRange])

    const loadPayments = async () => {
        setLoading(true)
        try {
            // В реальном приложении здесь будет запрос к API платежей
            // Пока используем моковые данные с фильтрацией

            let filteredPayments = [...mockPayments]

            if (filter !== 'all') {
                filteredPayments = filteredPayments.filter(p => p.status === filter.toUpperCase())
            }

            // Фильтрация по времени
            const now = new Date()
            const timeFilter = new Date()
            if (timeRange === 'week') {
                timeFilter.setDate(now.getDate() - 7)
            } else if (timeRange === 'month') {
                timeFilter.setMonth(now.getMonth() - 1)
            } else if (timeRange === 'year') {
                timeFilter.setFullYear(now.getFullYear() - 1)
            }

            filteredPayments = filteredPayments.filter(p =>
                new Date(p.createdAt) >= timeFilter
            )

            setPayments(filteredPayments)
        } catch (error) {
            console.error('Error loading payments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleExport = () => {
        alert('Экспорт платежей в разработке...')
    }

    const handleMarkAsPaid = (paymentId: string) => {
        if (confirm('Отметить платеж как оплаченный?')) {
            alert(`Платеж ${paymentId} отмечен как оплаченный`)
            loadPayments()
        }
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PAID':
                return {
                    color: 'bg-green-500',
                    icon: CheckCircle,
                    text: 'Оплачен'
                }
            case 'PENDING':
                return {
                    color: 'bg-yellow-500',
                    icon: Clock,
                    text: 'Ожидает'
                }
            case 'FAILED':
                return {
                    color: 'bg-red-500',
                    icon: XCircle,
                    text: 'Ошибка'
                }
            default:
                return {
                    color: 'bg-gray-500',
                    icon: AlertCircle,
                    text: status
                }
        }
    }

    const getMethodConfig = (method?: string) => {
        switch (method) {
            case 'Карта':
                return { color: 'text-blue-500', icon: CreditCard }
            case 'Наличные':
                return { color: 'text-green-500', icon: DollarSign }
            case 'Перевод':
                return { color: 'text-purple-500', icon: TrendingUp }
            default:
                return { color: 'text-gray-500', icon: DollarSign }
        }
    }

    const stats = {
        total: payments.reduce((sum, p) => sum + p.amount, 0),
        paid: payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
        pending: payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
        failed: payments.filter(p => p.status === 'FAILED').reduce((sum, p) => sum + p.amount, 0),
        count: payments.length,
        paidCount: payments.filter(p => p.status === 'PAID').length
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
                        onClick={loadPayments}
                        className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Общая сумма</div>
                            <div className="text-2xl font-bold mt-1">{formatPrice(stats.total)}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stats.count} платежей</div>
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
                            <div className="text-2xl font-bold mt-1">{formatPrice(stats.paid)}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stats.paidCount} платежей</div>
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
                            <div className="text-2xl font-bold mt-1">{formatPrice(stats.pending)}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {payments.filter(p => p.status === 'PENDING').length} платежей
                            </div>
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
                            <div className="text-2xl font-bold mt-1">{formatPrice(stats.failed)}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {payments.filter(p => p.status === 'FAILED').length} платежей
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-500" />
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
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border border-input hover:bg-accent'
                                    }`}
                            >
                                Все
                            </button>
                            <button
                                onClick={() => setFilter('paid')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'paid'
                                        ? 'bg-green-500 text-white'
                                        : 'border border-input hover:bg-accent'
                                    }`}
                            >
                                Оплаченные
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending'
                                        ? 'bg-yellow-500 text-white'
                                        : 'border border-input hover:bg-accent'
                                    }`}
                            >
                                Ожидают
                            </button>
                            <button
                                onClick={() => setFilter('failed')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'failed'
                                        ? 'bg-red-500 text-white'
                                        : 'border border-input hover:bg-accent'
                                    }`}
                            >
                                Ошибки
                            </button>
                        </div>
                    </div>
                    <div>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as any)}
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
                                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                        Платежи не найдены
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => {
                                    const statusConfig = getStatusConfig(payment.status)
                                    const methodConfig = getMethodConfig(payment.method)
                                    const StatusIcon = statusConfig.icon
                                    const MethodIcon = methodConfig.icon

                                    return (
                                        <tr key={payment.id} className="hover:bg-accent/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-mono text-sm">{payment.id}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Заказ: {payment.bookingId}
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
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <MethodIcon className={`w-4 h-4 ${methodConfig.color}`} />
                                                    <span className="text-sm">{payment.method || 'Не указан'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${statusConfig.color}`}></div>
                                                    <span className="text-sm">{statusConfig.text}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    {payment.paymentDate
                                                        ? formatDate(payment.paymentDate)
                                                        : formatDate(payment.createdAt)
                                                    }
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    {payment.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => handleMarkAsPaid(payment.id)}
                                                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                                                        >
                                                            Подтвердить
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/admin/bookings/${payment.bookingId}`}
                                                        className="p-1.5 border border-input rounded hover:bg-accent transition-colors"
                                                        title="Просмотр заказа"
                                                    >
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
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
            </div>

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