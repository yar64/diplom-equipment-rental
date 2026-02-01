// server/actions/equipment.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Валидация схемы
const equipmentSchema = z.object({
    name: z.string().min(2, 'Название слишком короткое'),
    description: z.string().min(10, 'Описание слишком короткое'),
    pricePerDay: z.number().positive('Цена должна быть положительной'),
    categoryId: z.string().min(1, 'Выберите категорию'),
    quantity: z.number().int().min(1, 'Количество должно быть не менее 1'),
})

// Тип для фильтров
interface EquipmentFilters {
    categoryId?: string
    search?: string
    featured?: boolean
    minPrice?: number
    maxPrice?: number
    limit?: number
}

// Тип для ответа
interface ActionResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Получение оборудования с фильтрами
export async function getEquipment(filters?: EquipmentFilters): Promise<ActionResponse> {
    try {
        const equipment = await prisma.equipment.findMany({
            where: {
                ...(filters?.categoryId && { categoryId: filters.categoryId }),
                ...(filters?.search && {
                    OR: [
                        { name: { contains: filters.search, mode: 'insensitive' } },
                        { description: { contains: filters.search, mode: 'insensitive' } },
                        { brand: { contains: filters.search, mode: 'insensitive' } },
                    ],
                }),
                ...(filters?.featured !== undefined && { featured: filters.featured }),
                ...(filters?.minPrice !== undefined && { pricePerDay: { gte: filters.minPrice } }),
                ...(filters?.maxPrice !== undefined && { pricePerDay: { lte: filters.maxPrice } }),
                available: true,
            },
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

        return { success: true, data: equipment }
    } catch (error: unknown) {
        console.error('Get equipment error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить оборудование' }
    }
}

// Получение оборудования по ID
export async function getEquipmentById(id: string): Promise<ActionResponse> {
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

        return { success: true, data: equipment }
    } catch (error: unknown) {
        console.error('Get equipment by id error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить оборудование' }
    }
}

// Создание оборудования (для админа)
export async function createEquipment(formData: FormData): Promise<ActionResponse> {
    try {
        const validatedData = equipmentSchema.parse({
            name: formData.get('name'),
            description: formData.get('description'),
            pricePerDay: Number(formData.get('pricePerDay')),
            categoryId: formData.get('categoryId'),
            quantity: Number(formData.get('quantity')),
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
    } catch (error: unknown) {
        console.error('Create equipment error:', error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0]?.message || 'Ошибка валидации' }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось добавить оборудование' }
    }
}

// Обновление оборудования
export async function updateEquipment(id: string, formData: FormData): Promise<ActionResponse> {
    try {
        const validatedData = equipmentSchema.partial().parse({
            name: formData.get('name'),
            description: formData.get('description'),
            pricePerDay: formData.get('pricePerDay') ? Number(formData.get('pricePerDay')) : undefined,
            categoryId: formData.get('categoryId'),
            quantity: formData.get('quantity') ? Number(formData.get('quantity')) : undefined,
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
    } catch (error: unknown) {
        console.error('Update equipment error:', error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0]?.message || 'Ошибка валидации' }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось обновить оборудование' }
    }
}

// Удаление оборудования
export async function deleteEquipment(id: string): Promise<ActionResponse> {
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
): Promise<ActionResponse<{ isFavorite: boolean }>> {
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