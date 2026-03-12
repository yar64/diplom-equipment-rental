// server/actions/inventory.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'
import { InventorySummary, InventoryHistoryItem, ActionResponse } from '@/shared/types'

// Функция для логирования изменений (принимает userId из клиента)
async function logInventoryChange(data: {
    equipmentId: string
    userId?: string | null
    action: string
    field?: string
    oldValue?: any
    newValue?: any
    quantity?: number
    reason?: string
}) {
    try {
        await prisma.inventoryLog.create({
            data: {
                equipmentId: data.equipmentId,
                userId: data.userId || null,
                action: data.action,
                field: data.field,
                oldValue: data.oldValue?.toString(),
                newValue: data.newValue?.toString(),
                quantity: data.quantity,
                reason: data.reason,
            }
        })
    } catch (error) {
        console.error('Error logging inventory change:', error)
    }
}

export async function getInventorySummary(): Promise<ActionResponse<InventorySummary>> {
    try {
        // Общая статистика
        const totalEquipment = await prisma.equipment.count()
        const totalItemsAgg = await prisma.equipment.aggregate({
            _sum: {
                quantity: true
            }
        })
        const totalItems = totalItemsAgg._sum.quantity || 0

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

        // Категории со статистикой
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
                    totalItems,
                    availableEquipment,
                    lowStockEquipment,
                    outOfStockEquipment
                },
                categories: categories.map(cat => ({
                    name: cat.name,
                    itemCount: cat.equipment.reduce((sum, eq) => sum + eq.quantity, 0),
                    bookingCount: cat.equipment.reduce((sum, eq) => sum + eq.bookings.length, 0)
                })),
                lowStockItems: lowStockItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    pricePerDay: item.pricePerDay,
                    category: item.category
                })),
                recentlyAdded: recentlyAdded.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    createdAt: item.createdAt,
                    category: item.category
                }))
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

// Обновление количества оборудования (теперь принимает userId)
export async function updateEquipmentQuantity(
    equipmentId: string,
    quantity: number,
    userId?: string | null,
    reason?: string
): Promise<ActionResponse> {
    try {
        if (quantity < 0) {
            return { success: false, error: 'Количество не может быть отрицательным' }
        }

        // Получаем текущее состояние
        const currentEquipment = await prisma.equipment.findUnique({
            where: { id: equipmentId },
            select: { quantity: true, name: true }
        })

        if (!currentEquipment) {
            return { success: false, error: 'Оборудование не найдено' }
        }

        // Обновляем количество
        const equipment = await prisma.equipment.update({
            where: { id: equipmentId },
            data: {
                quantity,
                available: quantity > 0
            }
        })

        // Логируем изменение
        await logInventoryChange({
            equipmentId,
            userId,
            action: 'UPDATE',
            field: 'quantity',
            oldValue: currentEquipment.quantity,
            newValue: quantity,
            quantity: quantity,
            reason: reason || `Изменение количества с ${currentEquipment.quantity} на ${quantity}`
        })

        revalidatePath('/admin/inventory')
        revalidatePath('/admin/equipment')
        revalidatePath(`/admin/equipment/${equipmentId}/edit`)

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

export async function getInventoryHistory(limit: number = 50): Promise<ActionResponse<InventoryHistoryItem[]>> {
    try {
        const logs = await prisma.inventoryLog.findMany({
            take: limit,
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

        const historyItems: InventoryHistoryItem[] = logs.map(log => ({
            id: log.id,
            action: log.action,
            equipmentName: log.equipment.name,
            equipmentId: log.equipmentId,
            userName: log.user?.name || 'Система',
            userId: log.userId,
            quantity: log.quantity || undefined,
            details: log.reason ||
                `${log.action === 'CREATE' ? 'Создание' :
                    log.action === 'UPDATE' ? `Изменение ${log.field}: ${log.oldValue} → ${log.newValue}` :
                        log.action === 'DELETE' ? 'Удаление' :
                            log.action === 'BOOKING' ? 'Бронирование' :
                                log.action === 'RETURN' ? 'Возврат' : log.action}`,
            createdAt: log.createdAt
        }))

        return {
            success: true,
            data: historyItems
        }
    } catch (error: any) {
        console.error('Get inventory history error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось загрузить историю'
        }
    }
}

// Массовое обновление
export async function bulkUpdateQuantity(
    updates: { equipmentId: string; quantity: number; reason?: string }[],
    userId?: string | null
): Promise<ActionResponse> {
    try {
        const results = []
        const errors = []

        for (const update of updates) {
            try {
                const result = await updateEquipmentQuantity(
                    update.equipmentId,
                    update.quantity,
                    userId,
                    update.reason
                )
                if (result.success) {
                    results.push(result.data)
                } else {
                    errors.push({ equipmentId: update.equipmentId, error: result.error })
                }
            } catch (error) {
                errors.push({ equipmentId: update.equipmentId, error: 'Ошибка обновления' })
            }
        }

        if (errors.length === 0) {
            return { success: true, message: `Обновлено ${results.length} позиций` }
        } else {
            return {
                success: false,
                error: `Обновлено ${results.length}, ошибок: ${errors.length}`,
                data: { results, errors }
            }
        }
    } catch (error: any) {
        console.error('Bulk update error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Ошибка массового обновления'
        }
    }
}