// server/actions/payment.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PaymentStatus } from '@/shared/types'

// Типы
interface ActionResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

interface PaymentFilters {
    status?: PaymentStatus | string
    startDate?: Date
    endDate?: Date
    search?: string
    page?: number
    limit?: number
}

interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// Получение всех платежей
export async function getPayments(
    filters?: PaymentFilters
): Promise<ActionResponse<PaginatedResponse<any>>> {
    try {
        const page = filters?.page || 1
        const limit = filters?.limit || 25
        const skip = (page - 1) * limit

        const where: any = {}

        if (filters?.status) {
            where.status = filters.status
        }

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {}
            if (filters.startDate) where.createdAt.gte = filters.startDate
            if (filters.endDate) where.createdAt.lte = filters.endDate
        }

        if (filters?.search) {
            where.OR = [
                { booking: { equipment: { name: { contains: filters.search } } } },
                { booking: { user: { name: { contains: filters.search } } } },
                { booking: { user: { email: { contains: filters.search } } } },
                { transactionId: { contains: filters.search } },
            ]
        }

        const total = await prisma.payment.count({ where })

        const payments = await prisma.payment.findMany({
            where,
            include: {
                booking: {
                    include: {
                        equipment: {
                            select: {
                                name: true,
                            },
                        },
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                confirmedBy: {
                    select: {
                        name: true,
                    },
                },
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
                items: payments,
                total,
                page,
                limit,
                totalPages,
            },
        }
    } catch (error) {
        console.error('Get payments error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось загрузить платежи',
        }
    }
}

// Получение статистики по платежам
export async function getPaymentStats(filters?: { startDate?: Date; endDate?: Date }) {
    try {
        const where: any = {}

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {}
            if (filters.startDate) where.createdAt.gte = filters.startDate
            if (filters.endDate) where.createdAt.lte = filters.endDate
        }

        const payments = await prisma.payment.findMany({
            where,
            select: {
                amount: true,
                status: true,
            },
        })

        const stats = {
            total: payments.reduce((sum, p) => sum + p.amount, 0),
            paid: payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
            pending: payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
            failed: payments.filter(p => p.status === 'FAILED').reduce((sum, p) => sum + p.amount, 0),
            refunded: payments.filter(p => p.status === 'REFUNDED').reduce((sum, p) => sum + p.amount, 0),
            count: payments.length,
            paidCount: payments.filter(p => p.status === 'PAID').length,
            pendingCount: payments.filter(p => p.status === 'PENDING').length,
            failedCount: payments.filter(p => p.status === 'FAILED').length,
        }

        return { success: true, data: stats }
    } catch (error) {
        console.error('Get payment stats error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось получить статистику',
        }
    }
}

// Создание платежа для бронирования
export async function createPayment(
    bookingId: string,
    data: {
        amount: number
        method: string
        transactionId?: string
    }
) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { payment: true },
        })

        if (!booking) {
            return { success: false, error: 'Бронирование не найдено' }
        }

        if (booking.payment) {
            return { success: false, error: 'Платеж уже существует' }
        }

        const payment = await prisma.payment.create({
            data: {
                bookingId,
                amount: data.amount,
                method: data.method,
                transactionId: data.transactionId,
                status: 'PENDING',
            },
            include: {
                booking: {
                    include: {
                        equipment: true,
                        user: true,
                    },
                },
            },
        })

        revalidatePath('/admin/payments')
        revalidatePath(`/admin/bookings/${bookingId}`)

        return {
            success: true,
            data: payment,
            message: 'Платеж создан',
        }
    } catch (error) {
        console.error('Create payment error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось создать платеж',
        }
    }
}

// Обновление статуса платежа
export async function updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    confirmedById: string
) {
    try {
        const payment = await prisma.payment.update({
            where: { id: paymentId },
            data: {
                status,
                paidAt: status === 'PAID' ? new Date() : null,
                confirmedById: status === 'PAID' ? confirmedById : null,
            },
            include: {
                booking: {
                    include: {
                        user: true,
                        equipment: true,
                    },
                },
            },
        })

        // Если платеж подтвержден, создаем уведомление пользователю
        if (status === 'PAID') {
            await prisma.notification.create({
                data: {
                    userId: payment.booking.userId,
                    type: 'PAYMENT',
                    title: 'Платеж подтвержден',
                    message: `Оплата за "${payment.booking.equipment.name}" получена`,
                    link: `/bookings/${payment.bookingId}`,
                },
            })
        }

        revalidatePath('/admin/payments')
        revalidatePath(`/admin/payments/${paymentId}`)
        revalidatePath(`/admin/bookings/${payment.bookingId}`)

        return {
            success: true,
            data: payment,
            message: `Статус платежа изменен на ${status}`,
        }
    } catch (error) {
        console.error('Update payment status error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось обновить статус',
        }
    }
}

// Получение платежа по ID
export async function getPaymentById(id: string) {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                booking: {
                    include: {
                        equipment: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                confirmedBy: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        if (!payment) {
            return { success: false, error: 'Платеж не найден' }
        }

        return { success: true, data: payment }
    } catch (error) {
        console.error('Get payment by id error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось загрузить платеж',
        }
    }
}

// Экспорт платежей (для CSV)
export async function exportPayments(filters?: PaymentFilters) {
    try {
        const where: any = {}

        if (filters?.status) {
            where.status = filters.status
        }

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {}
            if (filters.startDate) where.createdAt.gte = filters.startDate
            if (filters.endDate) where.createdAt.lte = filters.endDate
        }

        const payments = await prisma.payment.findMany({
            where,
            include: {
                booking: {
                    include: {
                        equipment: true,
                        user: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        // Формируем данные для CSV
        const csvData = payments.map(p => ({
            ID: p.id,
            'ID заказа': p.bookingId,
            Клиент: p.booking.user.name || 'Без имени',
            Email: p.booking.user.email,
            Оборудование: p.booking.equipment.name,
            Сумма: p.amount,
            Статус: p.status,
            Способ: p.method || '-',
            'ID транзакции': p.transactionId || '-',
            'Дата создания': p.createdAt.toISOString(),
            'Дата оплаты': p.paidAt?.toISOString() || '-',
        }))

        return { success: true, data: csvData }
    } catch (error) {
        console.error('Export payments error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось экспортировать платежи',
        }
    }
}