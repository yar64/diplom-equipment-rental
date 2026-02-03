// server/actions/category.actions.ts
'use server'

import prisma from '../utils/prisma'

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc',
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
    parentId?: string
}) {
    try {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')

        const category = await prisma.category.create({
            data: {
                name: formData.name,
                slug,
                description: formData.description,
                parentId: formData.parentId || null,
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
        parentId?: string
    }
) {
    try {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: formData.name,
                slug,
                description: formData.description,
                parentId: formData.parentId || null,
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
        // Проверяем, есть ли дочерние категории
        const children = await prisma.category.count({
            where: { parentId: id },
        })

        if (children > 0) {
            return {
                success: false,
                error: 'Нельзя удалить категорию с дочерними категориями'
            }
        }

        // Проверяем, есть ли оборудование в этой категории
        const equipmentCount = await prisma.equipment.count({
            where: { categoryId: id },
        })

        if (equipmentCount > 0) {
            return {
                success: false,
                error: 'Нельзя удалить категорию с оборудованием'
            }
        }

        await prisma.category.delete({
            where: { id },
        })

        return { success: true }
    } catch (error: unknown) {
        console.error('Delete category error:', error)

        if (error instanceof Error) {
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
                children: true,
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