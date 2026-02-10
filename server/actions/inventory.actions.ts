// server/actions/inventory.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'

// Тип для ответа
interface ActionResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Получение сводки по инвентарю
export async function getInventorySummary(): Promise<ActionResponse> {
    try {
        // Общая статистика
        const totalEquipment = await prisma.equipment.count()
        const totalItems = await prisma.equipment.aggregate({
            _sum: {
                quantity: true
            }
        })

        // Оборудование по статусам
        const availableEquipment = await prisma.equipment.count({
            where: { available: true, quantity: { gt: 0 } }
        })

        const lowStockEquipment = await prisma.equipment.count({
            where: {
                available: true,
                quantity: { lte: 2, gt: 0 }
            }
        })

        const outOfStockEquipment = await prisma.equipment.count({
            where: { quantity: 0 }
        })

        // Самые популярные категории
        const categories = await prisma.category.findMany({
            include: {
                equipment: {
                    select: {
                        quantity: true,
                        bookings: {
                            where: {
                                createdAt: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // За 30 дней
                                }
                            },
                            select: { id: true }
                        }
                    }
                }
            }
        })

        // Оборудование с низким запасом
        const lowStockItems = await prisma.equipment.findMany({
            where: {
                available: true,
                quantity: { lte: 2, gt: 0 }
            },
            include: {
                category: {
                    select: { name: true }
                }
            },
            orderBy: { quantity: 'asc' },
            take: 10
        })

        // Недавно добавленное оборудование
        const recentlyAdded = await prisma.equipment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                category: {
                    select: { name: true }
                }
            }
        })

        return {
            success: true,
            data: {
                summary: {
                    totalEquipment,
                    totalItems: totalItems._sum.quantity || 0,
                    availableEquipment,
                    lowStockEquipment,
                    outOfStockEquipment
                },
                categories: categories.map(cat => ({
                    name: cat.name,
                    itemCount: cat.equipment.reduce((sum, eq) => sum + eq.quantity, 0),
                    bookingCount: cat.equipment.reduce((sum, eq) => sum + eq.bookings.length, 0)
                })),
                lowStockItems,
                recentlyAdded
            }
        }
    } catch (error: any) {
        console.error('Get inventory summary error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось загрузить данные инвентаря'
        }
    }
}

// Обновление количества оборудования
export async function updateEquipmentQuantity(
    equipmentId: string,
    quantity: number
): Promise<ActionResponse> {
    try {
        if (quantity < 0) {
            return { success: false, error: 'Количество не может быть отрицательным' }
        }

        const equipment = await prisma.equipment.update({
            where: { id: equipmentId },
            data: {
                quantity,
                available: quantity > 0
            }
        })

        revalidatePath('/admin/inventory')
        revalidatePath('/admin/equipment')

        return {
            success: true,
            data: equipment,
            message: `Количество обновлено: ${quantity}`
        }
    } catch (error: any) {
        console.error('Update equipment quantity error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось обновить количество'
        }
    }
}

// Получение истории изменений инвентаря
export async function getInventoryHistory(): Promise<ActionResponse> {
    try {
        // В реальном приложении здесь была бы отдельная таблица истории
        // Пока возвращаем последние бронирования как пример активности
        const recentActivity = await prisma.booking.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                equipment: {
                    select: { name: true }
                },
                user: {
                    select: { name: true }
                }
            }
        })

        return {
            success: true,
            data: recentActivity.map(activity => ({
                id: activity.id,
                type: 'BOOKING',
                equipmentName: activity.equipment.name,
                userName: activity.user.name || 'Неизвестно',
                date: activity.createdAt,
                status: activity.status,
                details: `Бронирование ${activity.status}`
            }))
        }
    } catch (error: any) {
        console.error('Get inventory history error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось загрузить историю'
        }
    }
}