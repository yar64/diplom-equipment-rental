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