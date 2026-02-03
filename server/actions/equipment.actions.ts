// server/actions/equipment.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ==================== ВАЛИДАЦИЯ ====================

const equipmentSchema = z.object({
    name: z.string().min(2, 'Название слишком короткое'),
    description: z.string().min(10, 'Описание слишком короткое'),
    pricePerDay: z.number().positive('Цена должна быть положительной'),
    categoryId: z.string().min(1, 'Выберите категорию'),
    quantity: z.number().int().min(1, 'Количество должно быть не менее 1'),
})

// ==================== ТИПЫ ====================

// Тип для фильтров оборудования
interface EquipmentFilters {
    categoryId?: string
    search?: string
    featured?: boolean
    minPrice?: number
    maxPrice?: number
    limit?: number
}

// Тип для ответа серверных действий
interface ActionResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Тип для избранного
interface FavoriteResponse {
    isFavorite: boolean
}

// Тип для данных создания оборудования
interface CreateEquipmentData {
    name: string
    description: string
    pricePerDay: number
    categoryId: string
    quantity: number
}

// Тип для данных обновления оборудования
interface UpdateEquipmentData {
    name?: string
    description?: string
    pricePerDay?: number
    categoryId?: string
    quantity?: number
}

// ==================== ФУНКЦИИ ====================

// Получение оборудования с фильтрами
export async function getEquipment(
    filters?: EquipmentFilters
): Promise<ActionResponse> {
    try {
        const where: any = {
            available: true,
        }

        if (filters?.categoryId) {
            where.categoryId = filters.categoryId
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { description: { contains: filters.search } },
                { brand: { contains: filters.search } },
            ]
        }

        if (filters?.featured !== undefined) {
            where.featured = filters.featured
        }

        if (filters?.minPrice !== undefined) {
            where.pricePerDay = { gte: filters.minPrice }
        }

        if (filters?.maxPrice !== undefined) {
            where.pricePerDay = { ...where.pricePerDay, lte: filters.maxPrice }
        }

        const equipment = await prisma.equipment.findMany({
            where,
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: filters?.limit || 100,
        })

        return {
            success: true,
            data: equipment
        }
    } catch (error: unknown) {
        console.error('Get equipment error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить оборудование' }
    }
}

// Получение оборудования по ID
export async function getEquipmentById(
    id: string
): Promise<ActionResponse> {
    try {
        const equipment = await prisma.equipment.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        })

        if (!equipment) {
            return { success: false, error: 'Оборудование не найдено' }
        }

        return {
            success: true,
            data: equipment
        }
    } catch (error: unknown) {
        console.error('Get equipment by id error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить оборудование' }
    }
}

// Создание оборудования (для админа)
export async function createEquipment(
    formData: FormData
): Promise<ActionResponse> {
    try {
        const rawData = {
            name: formData.get('name'),
            description: formData.get('description'),
            pricePerDay: formData.get('pricePerDay'),
            categoryId: formData.get('categoryId'),
            quantity: formData.get('quantity'),
        }

        // Парсим и валидируем данные
        const validatedData = equipmentSchema.parse({
            ...rawData,
            pricePerDay: Number(rawData.pricePerDay),
            quantity: Number(rawData.quantity),
        })

        const equipment = await prisma.equipment.create({
            data: {
                ...validatedData,
                slug: validatedData.name.toLowerCase().replace(/\s+/g, '-'),
                images: JSON.stringify([]),
            },
        })

        revalidatePath('/catalog')
        revalidatePath('/admin/equipment')

        return {
            success: true,
            data: equipment,
            message: 'Оборудование успешно добавлено'
        }
    } catch (error) {
        console.error('Create equipment error:', error)

        if (error instanceof z.ZodError) {
            // Используем any для временного обхода
            const zodError = error as any
            return {
                success: false,
                error: zodError.errors?.[0]?.message || 'Ошибка валидации'
            }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось добавить оборудование' }
    }
}

// Обновление оборудования
export async function updateEquipment(
    id: string,
    formData: FormData
): Promise<ActionResponse> {
    try {
        const rawData = {
            name: formData.get('name'),
            description: formData.get('description'),
            pricePerDay: formData.get('pricePerDay'),
            categoryId: formData.get('categoryId'),
            quantity: formData.get('quantity'),
        }

        const validatedData = equipmentSchema.partial().parse({
            ...rawData,
            pricePerDay: rawData.pricePerDay ? Number(rawData.pricePerDay) : undefined,
            quantity: rawData.quantity ? Number(rawData.quantity) : undefined,
        })

        const equipment = await prisma.equipment.update({
            where: { id },
            data: validatedData,
        })

        revalidatePath('/catalog')
        revalidatePath(`/equipment/${equipment.slug}`)
        revalidatePath('/admin/equipment')

        return {
            success: true,
            data: equipment,
            message: 'Оборудование успешно обновлено'
        }
    } catch (error) {
        console.error('Update equipment error:', error)

        if (error instanceof z.ZodError) {
            const zodError = error as any
            return {
                success: false,
                error: zodError.errors?.[0]?.message || 'Ошибка валидации'
            }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось обновить оборудование' }
    }
}

// Удаление оборудования
export async function deleteEquipment(
    id: string
): Promise<ActionResponse> {
    try {
        await prisma.equipment.delete({
            where: { id },
        })

        revalidatePath('/catalog')
        revalidatePath('/admin/equipment')

        return {
            success: true,
            message: 'Оборудование успешно удалено'
        }
    } catch (error: unknown) {
        console.error('Delete equipment error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось удалить оборудование' }
    }
}

// Добавление в избранное
export async function toggleFavorite(
    equipmentId: string,
    userId: string
): Promise<ActionResponse<FavoriteResponse>> {
    try {
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_equipmentId: {
                    userId,
                    equipmentId,
                },
            },
        })

        if (existingFavorite) {
            await prisma.favorite.delete({
                where: {
                    userId_equipmentId: {
                        userId,
                        equipmentId,
                    },
                },
            })

            revalidatePath('/favorites')
            return {
                success: true,
                message: 'Удалено из избранного',
                data: { isFavorite: false }
            }
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    equipmentId,
                },
            })

            revalidatePath('/favorites')
            return {
                success: true,
                message: 'Добавлено в избранное',
                data: { isFavorite: true }
            }
        }
    } catch (error: unknown) {
        console.error('Toggle favorite error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось обновить избранное' }
    }
}