// server/actions/booking.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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

// Типы
interface BookingFilters {
    userId?: string
    status?: string
    startDate?: Date
    endDate?: Date
}

// Создание бронирования
export async function createBooking(formData: FormData, userId: string) {
    try {
        const validatedData = bookingSchema.parse({
            equipmentId: formData.get('equipmentId'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            eventType: formData.get('eventType'),
            eventAddress: formData.get('eventAddress'),
            eventDate: formData.get('eventDate'),
            attendeesCount: formData.get('attendeesCount')
                ? Number(formData.get('attendeesCount'))
                : undefined,
            notes: formData.get('notes'),
        })

        // Проверяем доступность оборудования
        const equipment = await prisma.equipment.findUnique({
            where: { id: validatedData.equipmentId },
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
                equipmentId: validatedData.equipmentId,
                status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
                OR: [
                    {
                        startDate: { lte: validatedData.endDate },
                        endDate: { gte: validatedData.startDate },
                    },
                ],
            },
        })

        if (conflictingBookings.length > 0) {
            return { success: false, error: 'Оборудование занято на выбранные даты' }
        }

        // Рассчитываем стоимость
        const totalDays = Math.ceil(
            (validatedData.endDate.getTime() - validatedData.startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )

        const totalPrice = totalDays * equipment.pricePerDay

        // Создаем бронирование
        const booking = await prisma.booking.create({
            data: {
                ...validatedData,
                userId,
                totalDays,
                totalPrice,
                status: 'PENDING',
                paymentStatus: 'PENDING',
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

        revalidatePath('/bookings')
        revalidatePath('/profile')

        return {
            success: true,
            data: booking,
            message: 'Бронирование создано успешно! Ожидайте подтверждения.'
        }
    } catch (error: unknown) {
        console.error('Create booking error:', error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0]?.message || 'Ошибка валидации' }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось создать бронирование' }
    }
}

// Получение бронирований пользователя
export async function getUserBookings(userId: string, filters?: BookingFilters) {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                userId,
                ...(filters?.status && { status: filters.status }),
                ...(filters?.startDate && { startDate: { gte: filters.startDate } }),
                ...(filters?.endDate && { endDate: { lte: filters.endDate } }),
            },
            include: {
                equipment: {
                    include: {
                        category: true,
                    },
                },
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
export async function getBookingById(id: string, userId?: string) {
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
export async function updateBookingStatus(id: string, status: string, adminId: string) {
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
            data: { status },
            include: {
                equipment: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

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
export async function cancelBooking(id: string, userId: string) {
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

        revalidatePath('/bookings')
        revalidatePath('/profile')

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
}): Promise<ActionResponse> {
    try {
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
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return { success: true, data: bookings }
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
        await prisma.booking.delete({
            where: { id },
        })

        revalidatePath('/admin/bookings')
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

        const totalRevenue = await prisma.booking.aggregate({
            _sum: { totalPrice: true },
            where: {
                status: { in: ['COMPLETED', 'ACTIVE'] },
                paymentStatus: 'PAID'
            }
        })

        const recentBookings = await prisma.booking.findMany({
            take: 5,
            include: {
                user: { select: { name: true } },
                equipment: { select: { name: true } },
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
                totalRevenue: totalRevenue._sum.totalPrice || 0,
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

// Тип для ActionResponse (добавим в начало файла)
interface ActionResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}