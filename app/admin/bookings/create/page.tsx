'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft, Calendar, Package, User,
    MapPin, Users, FileText, Save, Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { createBooking } from '@/server/actions/booking.actions'
import { getEquipment } from '@/server/actions/equipment.actions'
import { getUsers } from '@/server/actions/user.actions'
import { useUser } from '@/hooks/useUser'
import Button from '../../../components/ui/Button'

interface User {
    id: string
    name: string | null
    email: string
    phone: string | null
}

interface Equipment {
    id: string
    name: string
    pricePerDay: number
    quantity: number
    available: boolean
    category: {
        name: string
    } | null
}

export default function CreateBookingPage() {
    const router = useRouter()
    const { user: adminUser } = useUser()
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [equipment, setEquipment] = useState<Equipment[]>([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [loadingEquipment, setLoadingEquipment] = useState(true)
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalDays, setTotalDays] = useState(0)

    const [formData, setFormData] = useState({
        userId: '',
        equipmentId: '',
        startDate: '',
        endDate: '',
        eventType: '',
        eventAddress: '',
        eventDate: '',
        attendeesCount: '',
        notes: '',
    })

    // Загрузка пользователей и оборудования
    useEffect(() => {
        loadUsers()
        loadEquipment()
    }, [])

    // Расчет стоимости при изменении дат или оборудования
    useEffect(() => {
        if (formData.equipmentId && formData.startDate && formData.endDate) {
            calculatePrice()
        }
    }, [formData.equipmentId, formData.startDate, formData.endDate])

    const loadUsers = async () => {
        setLoadingUsers(true)
        try {
            const result = await getUsers()
            if (result.success && result.data) {
                setUsers(result.data)
            }
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoadingUsers(false)
        }
    }

    const loadEquipment = async () => {
        setLoadingEquipment(true)
        try {
            const result = await getEquipment({ available: true })
            if (result.success && result.data) {
                setEquipment(result.data.items || [])
            }
        } catch (error) {
            console.error('Error loading equipment:', error)
        } finally {
            setLoadingEquipment(false)
        }
    }

    const calculatePrice = () => {
        const selectedEquipment = equipment.find(e => e.id === formData.equipmentId)
        if (!selectedEquipment) return

        const start = new Date(formData.startDate)
        const end = new Date(formData.endDate)

        if (start && end && end > start) {
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
            setTotalDays(days)
            setTotalPrice(days * selectedEquipment.pricePerDay)
        } else {
            setTotalDays(0)
            setTotalPrice(0)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!adminUser?.id) {
            alert('Необходима авторизация')
            return
        }

        setSubmitting(true)

        const formDataObj = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataObj.append(key, value)
        })

        try {
            const result = await createBooking(formDataObj, adminUser.id)

            if (result.success) {
                router.push('/admin/bookings')
                router.refresh()
            } else {
                alert(result.error || 'Ошибка при создании бронирования')
            }
        } catch (error) {
            console.error('Submit error:', error)
            alert('Ошибка при создании бронирования')
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const selectedEquipment = equipment.find(e => e.id === formData.equipmentId)

    if (loadingUsers || loadingEquipment) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Загрузка данных...</p>
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
                <h1 className="text-2xl font-bold tracking-tight">Новое бронирование</h1>
                <p className="text-muted-foreground mt-1">
                    Создание бронирования от имени администратора
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Выбор пользователя */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Клиент
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Выберите пользователя *
                            </label>
                            <select
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                                className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            >
                                <option value="">Выберите пользователя</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name || 'Без имени'} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Выбор оборудования */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Оборудование
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Выберите оборудование *
                            </label>
                            <select
                                name="equipmentId"
                                value={formData.equipmentId}
                                onChange={handleChange}
                                required
                                className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            >
                                <option value="">Выберите оборудование</option>
                                {equipment.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} — {item.pricePerDay} ₽/день ({item.quantity} шт.)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedEquipment && (
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Информация об оборудовании</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Категория:</span>
                                        <p className="font-medium">{selectedEquipment.category?.name || 'Без категории'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Цена за день:</span>
                                        <p className="font-medium">{selectedEquipment.pricePerDay.toLocaleString()} ₽</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Доступно:</span>
                                        <p className="font-medium">{selectedEquipment.quantity} шт.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Даты бронирования */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Период аренды
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Дата начала *
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                min={format(new Date(), 'yyyy-MM-dd')}
                                className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Дата окончания *
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
                                className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            />
                        </div>
                    </div>

                    {totalDays > 0 && (
                        <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Итого:</span>
                                <span className="text-2xl font-bold text-primary">
                                    {totalPrice.toLocaleString()} ₽
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {totalDays} {totalDays === 1 ? 'день' : totalDays < 5 ? 'дня' : 'дней'} аренды
                            </p>
                        </div>
                    )}
                </div>

                {/* Информация о мероприятии */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Детали мероприятия
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Тип мероприятия
                            </label>
                            <input
                                type="text"
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                                placeholder="Например: Свадьба, Корпоратив, Концерт..."
                                className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Адрес проведения
                            </label>
                            <input
                                type="text"
                                name="eventAddress"
                                value={formData.eventAddress}
                                onChange={handleChange}
                                placeholder="Где будет проходить мероприятие"
                                className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Дата мероприятия
                                </label>
                                <input
                                    type="date"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Количество участников
                                </label>
                                <input
                                    type="number"
                                    name="attendeesCount"
                                    value={formData.attendeesCount}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="Например: 100"
                                    className="w-full border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Примечания
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
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
                        disabled={submitting || !formData.userId || !formData.equipmentId || !formData.startDate || !formData.endDate}
                        className="gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Создание...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Создать бронирование
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}