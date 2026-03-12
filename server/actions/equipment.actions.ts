// server/actions/equipment.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { EquipmentListItem, PaginatedEquipmentResponse } from '@/shared/types'

// ==================== ВАЛИДАЦИЯ ====================

const equipmentSchema = z.object({
    name: z.string().min(2, 'Название слишком короткое'),
    description: z.string().min(10, 'Описание слишком короткое'),
    fullDescription: z.string().optional(), // ← optional
    pricePerDay: z.number().positive('Цена должна быть положительной'),
    pricePerWeek: z.number().positive().optional(),
    pricePerMonth: z.number().positive().optional(),
    categoryId: z.string().min(1, 'Выберите категорию'),
    quantity: z.number().int().min(1, 'Количество должно быть не менее 1'),
    brand: z.string().optional(),
    model: z.string().optional(),
    weight: z.number().optional(),
    dimensions: z.string().optional(),
    powerRequirements: z.string().optional(),
    available: z.boolean().default(true),
    featured: z.boolean().default(false),
    mainImage: z.string().optional(),
    serialNumber: z.string().optional(),
})

// ==================== ТИПЫ ====================

// Тип для фильтров оборудования
interface EquipmentFilters {
    categoryId?: string
    search?: string
    featured?: boolean | string
    minPrice?: number
    maxPrice?: number
    limit?: number
    available?: boolean | string  // ← добавить строковый тип для select
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
    fullDescription?: string
    pricePerDay: number
    pricePerWeek?: number
    pricePerMonth?: number
    categoryId: string
    quantity: number
    brand?: string
    model?: string
    weight?: number
    dimensions?: string
    powerRequirements?: string
    available: boolean
    featured: boolean
    mainImage?: string
    serialNumber?: string
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
    filters?: EquipmentFilters & { page?: number; limit?: number }
): Promise<ActionResponse<PaginatedEquipmentResponse>> {
    try {
        const where: any = {
            //available: true,
        }

        // Пагинация
        const page = filters?.page || 1
        const limit = filters?.limit || 25
        const skip = (page - 1) * limit

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

        // Фильтр по статусу доступности
        if (filters?.available !== undefined && filters.available !== '') {
            if (typeof filters.available === 'string') {
                where.available = filters.available === 'true'
            } else {
                where.available = filters.available
            }
        }

        // Фильтр по рекомендуемым
        if (filters?.featured !== undefined && filters.featured !== '') {
            if (typeof filters.featured === 'string') {
                where.featured = filters.featured === 'true'
            } else {
                where.featured = filters.featured
            }
        }

        if (filters?.minPrice !== undefined) {
            where.pricePerDay = { gte: filters.minPrice }
        }

        if (filters?.maxPrice !== undefined) {
            where.pricePerDay = { ...where.pricePerDay, lte: filters.maxPrice }
        }

        console.log('🔍 Применяемые фильтры:', where)

        // Получаем общее количество записей (для пагинации)
        const total = await prisma.equipment.count({ where })

        // Получаем записи для текущей страницы
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
            skip,
            take: limit,
        })

        const totalPages = Math.ceil(total / limit)

        return {
            success: true,
            data: {
                items: equipment,
                total,
                page,
                limit,
                totalPages
            }
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
        // Функция для безопасного получения значения из FormData
        const getValue = (key: string): string | undefined => {
            const value = formData.get(key)
            return value ? String(value) : undefined
        }

        const rawData = {
            name: getValue('name'),
            description: getValue('description'),
            fullDescription: getValue('fullDescription'),
            pricePerDay: getValue('pricePerDay'),
            pricePerWeek: getValue('pricePerWeek'),
            pricePerMonth: getValue('pricePerMonth'),
            categoryId: getValue('categoryId'),
            quantity: getValue('quantity'),
            brand: getValue('brand'),
            model: getValue('model'),
            weight: getValue('weight'),
            dimensions: getValue('dimensions'),
            powerRequirements: getValue('powerRequirements'),
            available: formData.get('available') === 'true',
            featured: formData.get('featured') === 'true',
            mainImage: getValue('mainImage'),
            serialNumber: getValue('sku'),
        }

        // Валидация
        const equipmentSchema = z.object({
            name: z.string().min(2, 'Название слишком короткое'),
            description: z.string().min(5, 'Описание слишком короткое'),
            fullDescription: z.string().optional(),
            pricePerDay: z.number().positive('Цена должна быть положительной'),
            pricePerWeek: z.number().positive().optional(),
            pricePerMonth: z.number().positive().optional(),
            categoryId: z.string().min(1, 'Выберите категорию'),
            quantity: z.number().int().min(1, 'Количество должно быть не менее 1'),
            brand: z.string().optional(),
            model: z.string().optional(),
            weight: z.number().optional(),
            dimensions: z.string().optional(),
            powerRequirements: z.string().optional(),
            available: z.boolean().default(true),
            featured: z.boolean().default(false),
            mainImage: z.string().optional(),
            serialNumber: z.string().optional(),
        })

        const validatedData = equipmentSchema.parse({
            ...rawData,
            pricePerDay: rawData.pricePerDay ? Number(rawData.pricePerDay) : undefined,
            pricePerWeek: rawData.pricePerWeek ? Number(rawData.pricePerWeek) : undefined,
            pricePerMonth: rawData.pricePerMonth ? Number(rawData.pricePerMonth) : undefined,
            quantity: rawData.quantity ? Number(rawData.quantity) : undefined,
            weight: rawData.weight ? Number(rawData.weight) : undefined,
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

        // Проверяем, является ли ошибка ZodError
        if (error && typeof error === 'object' && 'errors' in error) {
            const zodError = error as { errors: Array<{ message: string }> }
            console.log('❌ Zod ошибка:', zodError.errors)

            const errorMessage = zodError.errors && zodError.errors.length > 0
                ? zodError.errors[0].message
                : 'Ошибка валидации данных'

            return {
                success: false,
                error: errorMessage
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
        // Функция для безопасного получения значения из FormData
        const getValue = (key: string): string | undefined => {
            const value = formData.get(key)
            return value ? String(value) : undefined
        }

        const rawData = {
            name: getValue('name'),
            description: getValue('description'),
            fullDescription: getValue('fullDescription'),
            pricePerDay: getValue('pricePerDay'),
            pricePerWeek: getValue('pricePerWeek'),
            pricePerMonth: getValue('pricePerMonth'),
            categoryId: getValue('categoryId'),
            quantity: getValue('quantity'),
            brand: getValue('brand'),
            model: getValue('model'),
            weight: getValue('weight'),
            dimensions: getValue('dimensions'),
            powerRequirements: getValue('powerRequirements'),
            available: formData.get('available') === 'true',
            featured: formData.get('featured') === 'true',
            mainImage: getValue('mainImage'),
            serialNumber: getValue('sku'),
            images: getValue('images') || '[]',
        }

        // Валидация
        const equipmentUpdateSchema = z.object({
            name: z.string().min(2, 'Название слишком короткое').optional(),
            description: z.string().min(5, 'Описание слишком короткое').optional(),
            fullDescription: z.string().optional(),
            pricePerDay: z.number().positive('Цена должна быть положительной').optional(),
            pricePerWeek: z.number().positive().optional(),
            pricePerMonth: z.number().positive().optional(),
            categoryId: z.string().min(1, 'Выберите категорию').optional(),
            quantity: z.number().int().min(1, 'Количество должно быть не менее 1').optional(),
            brand: z.string().optional(),
            model: z.string().optional(),
            weight: z.number().optional(),
            dimensions: z.string().optional(),
            powerRequirements: z.string().optional(),
            available: z.boolean().optional(),
            featured: z.boolean().optional(),
            mainImage: z.string().optional(),
            serialNumber: z.string().optional(),
            images: z.string().optional(),
        })

        const validatedData = equipmentUpdateSchema.parse({
            ...rawData,
            pricePerDay: rawData.pricePerDay ? Number(rawData.pricePerDay) : undefined,
            pricePerWeek: rawData.pricePerWeek ? Number(rawData.pricePerWeek) : undefined,
            pricePerMonth: rawData.pricePerMonth ? Number(rawData.pricePerMonth) : undefined,
            quantity: rawData.quantity ? Number(rawData.quantity) : undefined,
            weight: rawData.weight ? Number(rawData.weight) : undefined,
        })

        // Если название изменилось, обновляем slug
        const updateData: any = { ...validatedData }

        if (validatedData.name) {
            updateData.slug = validatedData.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
        }

        const equipment = await prisma.equipment.update({
            where: { id },
            data: updateData,
        })

        revalidatePath('/catalog')
        revalidatePath(`/catalog/${equipment.slug}`)
        revalidatePath('/admin/equipment')
        revalidatePath(`/admin/equipment/${id}/edit`)

        return {
            success: true,
            data: equipment,
            message: 'Оборудование успешно обновлено'
        }
    } catch (error) {
        console.error('❌ Update equipment error:', error)

        if (error instanceof z.ZodError) {
            console.log('📋 Zod ошибки:', error.issues)
            return {
                success: false,
                error: error.issues[0]?.message || 'Ошибка валидации'
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