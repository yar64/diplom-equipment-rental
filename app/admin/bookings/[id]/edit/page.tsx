'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft, Calendar, Package, User,
    MapPin, Users, FileText, Save, Loader2,
    AlertCircle
} from 'lucide-react'
import { getBookingById, updateBookingStatus } from '@/server/actions/booking.actions'
import { getEquipment } from '@/server/actions/equipment.actions'
import { useUser } from '@/hooks/useUser'
import Button from '../../../../components/ui/Button'
import { format } from 'date-fns'

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

export default function EditBookingPage() {
    const router = useRouter()
    const params = useParams()
    const bookingId = params.id as string
    const { user } = useUser()

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [booking, setBooking] = useState<Booking | null>(null)
    const [formData, setFormData] = useState({
        status: '',
        notes: '',
    })

    useEffect(() => {
        if (bookingId) {
            loadBooking()
        }
    }, [bookingId])

    const loadBooking = async () => {
        setLoading(true)
        try {
            const result = await getBookingById(bookingId)
            if (result.success && result.data) {
                const bookingData = result.data as Booking
                setBooking(bookingData)
                setFormData({
                    status: bookingData.status,
                    notes: bookingData.notes || '',
                })
            } else {
                alert('Бронирование не найдено')
                router.push('/admin/bookings')
            }
        } catch (error) {
            console.error('Error loading booking:', error)
            alert('Ошибка при загрузке бронирования')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user?.id) {
            alert('Необходима авторизация')
            return
        }

        if (!booking) return

        setSubmitting(true)

        try {
            // Обновляем только статус и примечания
            const result = await updateBookingStatus(bookingId, formData.status, user.id)

            if (result.success) {
                router.push('/admin/bookings')
                router.refresh()
            } else {
                alert(result.error || 'Ошибка при обновлении бронирования')
            }
        } catch (error) {
            console.error('Submit error:', error)
            alert('Ошибка при обновлении бронирования')
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const statusOptions = [
        { value: 'PENDING', label: 'Ожидает' },
        { value: 'CONFIRMED', label: 'Подтверждено' },
        { value: 'ACTIVE', label: 'Активно' },
        { value: 'COMPLETED', label: 'Завершено' },
        { value: 'CANCELLED', label: 'Отменено' },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Загрузка данных...</p>
                </div>
            </div>
        )
    }

    if (!booking) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <p className="text-lg font-medium">Бронирование не найдено</p>
                    <Link
                        href="/admin/bookings"
                        className="text-primary hover:underline mt-2 inline-block"
                    >
                        Вернуться к списку
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Заголовок */}
            <div>
                <Link
                    href="/admin/bookings"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Назад к бронированиям
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Редактирование бронирования</h1>
                <p className="text-muted-foreground mt-1">
                    #{booking.id.slice(0, 8)} • {booking.equipment.name}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Информация о клиенте (только для чтения) */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Клиент
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
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

                {/* Информация об оборудовании (только для чтения) */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Оборудование
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
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
                            <div className="font-medium">{booking.equipment.pricePerDay.toLocaleString()} ₽</div>
                        </div>
                    </div>
                </div>

                {/* Период аренды (только для чтения) */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Период аренды
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-muted-foreground">Дата начала</div>
                            <div className="font-medium">{format(new Date(booking.startDate), 'dd.MM.yyyy')}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Дата окончания</div>
                            <div className="font-medium">{format(new Date(booking.endDate), 'dd.MM.yyyy')}</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {booking.totalDays} {booking.totalDays === 1 ? 'день' : 'дней'}
                            </span>
                            <span className="text-xl font-bold text-primary">
                                {booking.totalPrice.toLocaleString()} ₽
                            </span>
                        </div>
                    </div>
                </div>

                {/* Детали мероприятия (только для чтения) */}
                {(booking.eventType || booking.eventAddress || booking.eventDate || booking.attendeesCount) && (
                    <div className="border border-border rounded-lg bg-background p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Детали мероприятия
                        </h2>

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
                                    <div className="font-medium">{format(new Date(booking.eventDate), 'dd.MM.yyyy')}</div>
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

                {/* Редактируемые поля */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Управление бронированием</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Статус бронирования
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Примечания
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Дополнительная информация о бронировании..."
                                className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin/bookings">
                        <Button variant="outline" type="button">
                            Отмена
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Сохранение...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Сохранить изменения
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}