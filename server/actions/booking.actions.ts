// server/actions/booking.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { BookingStatus, PaymentStatus, ActionResponse } from '@/shared/types'

// Валидация схемы бронирования
const bookingSchema = z.object({
    equipmentId: z.string().min(1, 'Выберите оборудование'),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    eventType: z.string().optional(),
    eventAddress: z.string().optional(),
    eventDate: z.string().transform((str) => new Date(str)).optional(),
    attendeesCount: z.number().min(1, 'Укажите количество участников').optional(),
    notes: z.string().optional(),
})

// Типы для фильтров
interface BookingFilters {
    userId?: string
    status?: BookingStatus | string
    startDate?: Date
    endDate?: Date
}

// Тип для ответа с пагинацией
interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// Создание бронирования
export async function createBooking(formData: FormData, userId: string): Promise<ActionResponse> {
    try {
        // Функция для безопасного получения значения из FormData
        const getField = (key: string): string | undefined => {
            const value = formData.get(key)
            return value === null ? undefined : value.toString()
        }

        const equipmentId = getField('equipmentId')
        const startDateStr = getField('startDate')
        const endDateStr = getField('endDate')
        const eventType = getField('eventType')
        const eventAddress = getField('eventAddress')
        const eventDateStr = getField('eventDate')
        const attendeesCountStr = getField('attendeesCount')
        const notes = getField('notes')
        const paymentMethod = getField('paymentMethod') // Получаем метод оплаты

        // Валидация обязательных полей
        if (!equipmentId) {
            return { success: false, error: 'Выберите оборудование' }
        }

        if (!startDateStr) {
            return { success: false, error: 'Укажите дату начала' }
        }

        if (!endDateStr) {
            return { success: false, error: 'Укажите дату окончания' }
        }

        // Преобразуем строки в Date
        const startDate = new Date(startDateStr)
        const endDate = new Date(endDateStr)
        const eventDate = eventDateStr ? new Date(eventDateStr) : undefined

        // Проверяем корректность дат
        if (isNaN(startDate.getTime())) {
            return { success: false, error: 'Некорректная дата начала' }
        }

        if (isNaN(endDate.getTime())) {
            return { success: false, error: 'Некорректная дата окончания' }
        }

        if (endDate <= startDate) {
            return { success: false, error: 'Дата окончания должна быть позже даты начала' }
        }

        // Преобразуем количество участников
        let attendeesCount: number | undefined = undefined
        if (attendeesCountStr && attendeesCountStr.trim() !== '') {
            const parsed = parseInt(attendeesCountStr)
            if (!isNaN(parsed) && parsed > 0) {
                attendeesCount = parsed
            }
        }

        // Проверяем доступность оборудования
        const equipment = await prisma.equipment.findUnique({
            where: { id: equipmentId },
        })

        if (!equipment) {
            return { success: false, error: 'Оборудование не найдено' }
        }

        if (!equipment.available || equipment.quantity < 1) {
            return { success: false, error: 'Оборудование недоступно для бронирования' }
        }

        // Проверяем пересечение дат
        const conflictingBookings = await prisma.booking.findMany({
            where: {
                equipmentId,
                status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
                OR: [
                    {
                        startDate: { lte: endDate },
                        endDate: { gte: startDate },
                    },
                ],
            },
        })

        if (conflictingBookings.length > 0) {
            return { success: false, error: 'Оборудование занято на выбранные даты' }
        }

        // Рассчитываем стоимость
        const totalDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        const totalPrice = totalDays * equipment.pricePerDay

        // Создаем бронирование
        const booking = await prisma.booking.create({
            data: {
                equipmentId,
                userId,
                startDate,
                endDate,
                totalDays,
                totalPrice,
                eventType,
                eventAddress,
                eventDate,
                attendeesCount,
                notes,
                status: 'PENDING',
            },
            include: {
                equipment: {
                    include: {
                        category: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        })

        // ✅ СОЗДАЕМ ПЛАТЕЖ
        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                amount: totalPrice,
                status: 'PENDING',
                method: paymentMethod || null,
            }
        })

        revalidatePath('/admin/bookings')
        revalidatePath('/bookings')
        revalidatePath('/profile')

        return {
            success: true,
            data: booking,
            message: 'Бронирование создано успешно! Ожидайте подтверждения.'
        }
    } catch (error: unknown) {
        console.error('Create booking error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось создать бронирование' }
    }
}

// Получение бронирований пользователя
export async function getUserBookings(userId: string, filters?: BookingFilters): Promise<ActionResponse> {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                userId,
                ...(filters?.status && { status: filters.status as BookingStatus }),
                ...(filters?.startDate && { startDate: { gte: filters.startDate } }),
                ...(filters?.endDate && { endDate: { lte: filters.endDate } }),
            },
            include: {
                equipment: {
                    include: {
                        category: true,
                    },
                },
                payment: true, // ✅ Включаем платеж
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return { success: true, data: bookings }
    } catch (error: unknown) {
        console.error('Get user bookings error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить бронирования' }
    }
}

// Получение бронирования по ID
export async function getBookingById(id: string, userId?: string): Promise<ActionResponse> {
    try {
        const whereClause: any = { id }

        // Если передан userId, проверяем что бронирование принадлежит пользователю
        if (userId) {
            whereClause.userId = userId
        }

        const booking = await prisma.booking.findUnique({
            where: whereClause,
            include: {
                equipment: {
                    include: {
                        category: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                payment: true, // ✅ Включаем платеж
            },
        })

        if (!booking) {
            return { success: false, error: 'Бронирование не найдено' }
        }

        return { success: true, data: booking }
    } catch (error: unknown) {
        console.error('Get booking by id error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить бронирование' }
    }
}

// Обновление статуса бронирования (для админа)
export async function updateBookingStatus(id: string, status: string, adminId: string): Promise<ActionResponse> {
    try {
        // Проверяем что пользователь - админ
        const admin = await prisma.user.findUnique({
            where: { id: adminId, role: { in: ['ADMIN', 'MANAGER'] } },
        })

        if (!admin) {
            return { success: false, error: 'Недостаточно прав' }
        }

        const booking = await prisma.booking.update({
            where: { id },
            data: { status: status as BookingStatus },
            include: {
                equipment: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                payment: true, // ✅ Включаем платеж
            },
        })

        // ✅ ЕСЛИ СТАТУС ПОДТВЕРЖДЕН, ПРОВЕРЯЕМ ПЛАТЕЖ
        if (status === 'CONFIRMED' || status === 'ACTIVE') {
            const existingPayment = await prisma.payment.findUnique({
                where: { bookingId: id }
            })

            if (!existingPayment) {
                await prisma.payment.create({
                    data: {
                        bookingId: id,
                        amount: booking.totalPrice,
                        status: 'PENDING',
                        method: 'pending',
                    }
                })
            }
        }

        // ✅ ЕСЛИ БРОНИРОВАНИЕ ЗАВЕРШЕНО, ПРОВЕРЯЕМ СТАТУС ПЛАТЕЖА
        if (status === 'COMPLETED') {
            const payment = await prisma.payment.findUnique({
                where: { bookingId: id }
            })

            // Если платеж все еще в статусе PENDING, меняем на PAID (оплачено при получении)
            if (payment && payment.status === 'PENDING') {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'PAID',
                        paidAt: new Date(),
                        confirmedById: adminId,
                    }
                })
            }
        }

        // Создаем уведомление для пользователя
        await prisma.notification.create({
            data: {
                userId: booking.userId,
                type: 'BOOKING_UPDATE',
                title: `Статус заказа изменен на "${status}"`,
                message: `Статус вашего заказа #${booking.id} на "${booking.equipment.name}" изменен`,
                link: `/bookings/${booking.id}`,
            },
        })

        revalidatePath('/admin/bookings')
        revalidatePath(`/bookings/${id}`)
        revalidatePath('/profile')
        revalidatePath('/admin/payments') // ✅ Обновляем страницу платежей

        return {
            success: true,
            data: booking,
            message: 'Статус бронирования обновлен'
        }
    } catch (error: unknown) {
        console.error('Update booking status error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось обновить статус бронирования' }
    }
}

// Отмена бронирования
export async function cancelBooking(id: string, userId: string): Promise<ActionResponse> {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id },
        })

        if (!booking) {
            return { success: false, error: 'Бронирование не найдено' }
        }

        if (booking.userId !== userId) {
            return { success: false, error: 'Вы не можете отменить это бронирование' }
        }

        // Можно отменять только бронирования в статусе PENDING или CONFIRMED
        if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
            return {
                success: false,
                error: 'Невозможно отменить бронирование в текущем статусе'
            }
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
        })

        // ✅ Отменяем платеж, если он был
        await prisma.payment.updateMany({
            where: { bookingId: id, status: 'PENDING' },
            data: { status: 'FAILED' }
        })

        revalidatePath('/bookings')
        revalidatePath('/profile')
        revalidatePath('/admin/payments')

        return {
            success: true,
            data: updatedBooking,
            message: 'Бронирование успешно отменено'
        }
    } catch (error: unknown) {
        console.error('Cancel booking error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось отменить бронирование' }
    }
}

// Получение всех бронирований для админки
export async function getAllBookings(filters?: {
    status?: string
    search?: string
    startDate?: Date
    endDate?: Date
    userId?: string
    equipmentId?: string
    page?: number
    limit?: number
}): Promise<ActionResponse<PaginatedResponse<any>>> {
    try {
        const page = filters?.page || 1
        const limit = filters?.limit || 25
        const skip = (page - 1) * limit

        const where: any = {}

        if (filters?.status) {
            where.status = filters.status
        }

        if (filters?.userId) {
            where.userId = filters.userId
        }

        if (filters?.equipmentId) {
            where.equipmentId = filters.equipmentId
        }

        if (filters?.search) {
            where.OR = [
                {
                    equipment: {
                        name: { contains: filters.search }
                    }
                },
                {
                    user: {
                        OR: [
                            { name: { contains: filters.search } },
                            { email: { contains: filters.search } }
                        ]
                    }
                },
                { eventAddress: { contains: filters.search } },
                { id: { contains: filters.search } },
            ]
        }

        if (filters?.startDate) {
            where.startDate = { gte: filters.startDate }
        }

        if (filters?.endDate) {
            where.endDate = { lte: filters.endDate }
        }

        const total = await prisma.booking.count({ where })

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                equipment: {
                    select: {
                        id: true,
                        name: true,
                        pricePerDay: true,
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                payment: true, // ✅ Включаем платеж
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        })

        const totalPages = Math.ceil(total / limit)

        return {
            success: true,
            data: {
                items: bookings,
                total,
                page,
                limit,
                totalPages
            }
        }
    } catch (error: any) {
        console.error('Get all bookings error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось загрузить бронирования'
        }
    }
}

// Удаление бронирования (для админа)
export async function deleteBooking(id: string): Promise<ActionResponse> {
    try {
        // Сначала удаляем связанный платеж (он удалится каскадно, но для порядка)
        await prisma.payment.deleteMany({
            where: { bookingId: id }
        })

        await prisma.booking.delete({
            where: { id },
        })

        revalidatePath('/admin/bookings')
        revalidatePath('/admin/payments')

        return {
            success: true,
            message: 'Бронирование удалено'
        }
    } catch (error: any) {
        console.error('Delete booking error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось удалить бронирование'
        }
    }
}

// Получение статистики по бронированиям
export async function getBookingStats(): Promise<ActionResponse> {
    try {
        const totalBookings = await prisma.booking.count()
        const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING' } })
        const activeBookings = await prisma.booking.count({
            where: {
                status: { in: ['CONFIRMED', 'ACTIVE'] }
            }
        })
        const completedBookings = await prisma.booking.count({ where: { status: 'COMPLETED' } })

        const totalRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'PAID' }
        })

        const recentBookings = await prisma.booking.findMany({
            take: 5,
            include: {
                user: { select: { name: true } },
                equipment: { select: { name: true } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        return {
            success: true,
            data: {
                totalBookings,
                pendingBookings,
                activeBookings,
                completedBookings,
                totalRevenue: totalRevenue._sum.amount || 0,
                recentBookings
            }
        }
    } catch (error: any) {
        console.error('Get booking stats error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось получить статистику'
        }
    }
}

// Массовое обновление статусов
export async function updateBookingStatusBatch(
    bookingIds: string[],
    status: string,
    adminId: string
): Promise<ActionResponse> {
    try {
        // Проверяем что пользователь - админ
        const admin = await prisma.user.findUnique({
            where: { id: adminId, role: { in: ['ADMIN', 'MANAGER'] } },
        })

        if (!admin) {
            return { success: false, error: 'Недостаточно прав' }
        }

        const result = await prisma.booking.updateMany({
            where: { id: { in: bookingIds } },
            data: { status: status as BookingStatus },
        })

        // Обновляем платежи для подтвержденных бронирований
        if (status === 'CONFIRMED' || status === 'ACTIVE') {
            const bookings = await prisma.booking.findMany({
                where: { id: { in: bookingIds } },
                select: { id: true, totalPrice: true }
            })

            for (const booking of bookings) {
                const existingPayment = await prisma.payment.findUnique({
                    where: { bookingId: booking.id }
                })

                if (!existingPayment) {
                    await prisma.payment.create({
                        data: {
                            bookingId: booking.id,
                            amount: booking.totalPrice,
                            status: 'PENDING',
                        }
                    })
                }
            }
        }

        // Создаем уведомления для каждого пользователя
        const bookings = await prisma.booking.findMany({
            where: { id: { in: bookingIds } },
            include: {
                user: { select: { id: true } },
                equipment: { select: { name: true } },
            },
        })

        for (const booking of bookings) {
            await prisma.notification.create({
                data: {
                    userId: booking.user.id,
                    type: 'BOOKING_UPDATE',
                    title: `Статус заказа изменен`,
                    message: `Статус вашего заказа на "${booking.equipment.name}" изменен на "${status}"`,
                    link: `/bookings/${booking.id}`,
                },
            })
        }

        revalidatePath('/admin/bookings')
        revalidatePath('/admin/payments')

        return {
            success: true,
            message: `Обновлено ${result.count} бронирований`
        }
    } catch (error: any) {
        console.error('Batch update booking status error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось обновить статусы'
        }
    }
}