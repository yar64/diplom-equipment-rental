// server/actions/category.actions.ts
'use server'

import prisma from '../utils/prisma'
import { ActionResponse } from '@/shared/types'
import { Category } from '@prisma/client'

// Тип для категории с количеством оборудования и дочерних категорий
export type CategoryWithStats = Category & {
    _count?: {
        equipment: number
        children: number
    }
}

export async function getCategories(): Promise<ActionResponse<CategoryWithStats[]>> {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
            include: {
                _count: {
                    select: {
                        equipment: true,
                        children: true,
                    },
                },
            },
        })

        return { success: true, data: categories }
    } catch (error: unknown) {
        console.error('Get categories error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить категории' }
    }
}

export async function createCategory(formData: {
    name: string
    description?: string
    parentId?: string | null
}) {
    try {
        // Генерируем slug из названия
        const slug = formData.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // удаляем спецсимволы
            .replace(/\s+/g, '-') // заменяем пробелы на дефисы
            .replace(/-+/g, '-') // убираем множественные дефисы
            .replace(/^-|-$/g, '') // убираем дефисы в начале и конце

        // Проверяем уникальность slug
        const existingCategory = await prisma.category.findUnique({
            where: { slug }
        })

        if (existingCategory) {
            return {
                success: false,
                error: 'Категория с таким названием уже существует'
            }
        }

        const category = await prisma.category.create({
            data: {
                name: formData.name,
                slug,
                description: formData.description,
                parentId: formData.parentId || null,
            },
            include: {
                _count: {
                    select: {
                        equipment: true,
                        children: true,
                    },
                },
            },
        })

        return { success: true, data: category }
    } catch (error: unknown) {
        console.error('Create category error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось создать категорию' }
    }
}

export async function updateCategory(
    id: string,
    formData: {
        name: string
        description?: string
        parentId?: string | null
    }
) {
    try {
        // Проверяем, не пытаемся ли сделать категорию родителем самой себя
        if (formData.parentId === id) {
            return {
                success: false,
                error: 'Категория не может быть родителем самой себя'
            }
        }

        // Проверяем, не пытаемся ли сделать категорию родителем своего потомка
        if (formData.parentId) {
            const descendants = await getDescendantIds(id)
            if (descendants.includes(formData.parentId)) {
                return {
                    success: false,
                    error: 'Нельзя сделать родителем дочернюю категорию'
                }
            }
        }

        // Генерируем новый slug
        const slug = formData.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')

        // Проверяем уникальность slug (исключая текущую категорию)
        const existingCategory = await prisma.category.findFirst({
            where: {
                slug,
                NOT: { id }
            }
        })

        if (existingCategory) {
            return {
                success: false,
                error: 'Категория с таким названием уже существует'
            }
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: formData.name,
                slug,
                description: formData.description,
                parentId: formData.parentId || null,
            },
            include: {
                _count: {
                    select: {
                        equipment: true,
                        children: true,
                    },
                },
            },
        })

        return { success: true, data: category }
    } catch (error: unknown) {
        console.error('Update category error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось обновить категорию' }
    }
}

export async function deleteCategory(id: string) {
    try {
        console.log('🗑️ Попытка удаления категории:', id)

        // Проверяем, существует ли категория
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        equipment: true,
                        children: true,
                    },
                },
            },
        })

        if (!category) {
            console.log('❌ Категория не найдена')
            return {
                success: false,
                error: 'Категория не найдена'
            }
        }

        console.log('📊 Статистика категории:', {
            equipment: category._count.equipment,
            children: category._count.children
        })

        // Проверяем, есть ли дочерние категории
        if (category._count.children > 0) {
            return {
                success: false,
                error: `Нельзя удалить категорию с дочерними категориями (${category._count.children} шт.)`
            }
        }

        // Проверяем, есть ли оборудование в этой категории
        if (category._count.equipment > 0) {
            return {
                success: false,
                error: `Нельзя удалить категорию с оборудованием (${category._count.equipment} шт.)`
            }
        }

        // Удаляем категорию
        await prisma.category.delete({
            where: { id },
        })

        console.log('✅ Категория успешно удалена')
        return { success: true }

    } catch (error: unknown) {
        console.error('❌ Delete category error:', error)

        // Более подробная обработка ошибок Prisma
        if (error instanceof Error) {
            // Ошибка внешнего ключа
            if (error.message.includes('foreign key')) {
                return {
                    success: false,
                    error: 'Категория используется в других записях'
                }
            }
            // Другие ошибки Prisma
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось удалить категорию' }
    }
}

export async function getCategoryById(id: string) {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: {
                    include: {
                        _count: {
                            select: {
                                equipment: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        equipment: true,
                        children: true,
                    },
                },
            },
        })

        if (!category) {
            return { success: false, error: 'Категория не найдена' }
        }

        return { success: true, data: category }
    } catch (error: unknown) {
        console.error('Get category by id error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить категорию' }
    }
}

// Вспомогательная функция для получения всех ID дочерних категорий
async function getDescendantIds(id: string): Promise<string[]> {
    const children = await prisma.category.findMany({
        where: { parentId: id },
        select: { id: true }
    })

    const descendantIds: string[] = []

    for (const child of children) {
        descendantIds.push(child.id)
        const grandChildren = await getDescendantIds(child.id)
        descendantIds.push(...grandChildren)
    }

    return descendantIds
}

export async function getCategoriesTree() {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId: null },
            include: {
                children: {
                    include: {
                        children: {
                            include: {
                                _count: {
                                    select: {
                                        equipment: true,
                                    },
                                },
                            },
                        },
                        _count: {
                            select: {
                                equipment: true,
                                children: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        equipment: true,
                        children: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        return { success: true, data: categories }
    } catch (error: unknown) {
        console.error('Get categories tree error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить дерево категорий' }
    }
}