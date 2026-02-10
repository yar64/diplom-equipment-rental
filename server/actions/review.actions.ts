// server/actions/review.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Валидация схемы отзыва
const reviewSchema = z.object({
    rating: z.number().min(1, 'Минимальная оценка - 1').max(5, 'Максимальная оценка - 5'),
    comment: z.string().min(10, 'Отзыв должен содержать минимум 10 символов'),
    equipmentId: z.string().min(1, 'Выберите оборудование'),
})

// Создание отзыва
export async function createReview(formData: FormData, userId: string) {
    try {
        const validatedData = reviewSchema.parse({
            rating: Number(formData.get('rating')),
            comment: formData.get('comment'),
            equipmentId: formData.get('equipmentId'),
        })

        // Проверяем существование оборудования
        const equipment = await prisma.equipment.findUnique({
            where: { id: validatedData.equipmentId },
        })

        if (!equipment) {
            return { success: false, error: 'Оборудование не найдено' }
        }

        // Проверяем был ли уже отзыв от этого пользователя
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_equipmentId: {
                    userId,
                    equipmentId: validatedData.equipmentId,
                },
            },
        })

        if (existingReview) {
            return { success: false, error: 'Вы уже оставляли отзыв на это оборудование' }
        }

        // Проверяем было ли у пользователя бронирование этого оборудования
        const hasBooking = await prisma.booking.findFirst({
            where: {
                userId,
                equipmentId: validatedData.equipmentId,
                status: 'COMPLETED',
            },
        })

        // Создаем отзыв
        const review = await prisma.review.create({
            data: {
                ...validatedData,
                userId,
                isVerified: !!hasBooking, // Отзыв верифицирован если было бронирование
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                equipment: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        })

        // Обновляем рейтинг оборудования
        const allReviews = await prisma.review.findMany({
            where: { equipmentId: validatedData.equipmentId },
            select: { rating: true },
        })

        const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

        await prisma.equipment.update({
            where: { id: validatedData.equipmentId },
            data: {
                rating: averageRating,
                reviewCount: allReviews.length,
            },
        })

        revalidatePath(`/equipment/${equipment.slug}`)
        revalidatePath('/reviews')

        return {
            success: true,
            data: review,
            message: hasBooking
                ? 'Отзыв успешно добавлен (верифицирован)'
                : 'Отзыв успешно добавлен'
        }
    } catch (error: unknown) {
        console.error('Create review error:', error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0]?.message || 'Ошибка валидации' }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось добавить отзыв' }
    }
}

// Получение отзывов оборудования
export async function getEquipmentReviews(equipmentId: string) {
    try {
        const reviews = await prisma.review.findMany({
            where: { equipmentId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return { success: true, data: reviews }
    } catch (error: unknown) {
        console.error('Get equipment reviews error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить отзывы' }
    }
}

// Получение последних отзывов
export async function getLatestReviews(limit: number = 10) {
    try {
        const reviews = await prisma.review.findMany({
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                equipment: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        mainImage: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                isVerified: true, // Показываем только верифицированные отзывы
            },
        })

        return { success: true, data: reviews }
    } catch (error: unknown) {
        console.error('Get latest reviews error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить отзывы' }
    }
}

// Удаление отзыва
export async function deleteReview(reviewId: string, userId: string) {
    try {
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                equipment: true,
            },
        })

        if (!review) {
            return { success: false, error: 'Отзыв не найден' }
        }

        // Проверяем права (пользователь или админ)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        })

        const isOwner = review.userId === userId
        const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER'

        if (!isOwner && !isAdmin) {
            return { success: false, error: 'Недостаточно прав для удаления отзыва' }
        }

        await prisma.review.delete({
            where: { id: reviewId },
        })

        // Обновляем рейтинг оборудования
        const remainingReviews = await prisma.review.findMany({
            where: { equipmentId: review.equipmentId },
            select: { rating: true },
        })

        if (remainingReviews.length > 0) {
            const averageRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length

            await prisma.equipment.update({
                where: { id: review.equipmentId },
                data: {
                    rating: averageRating,
                    reviewCount: remainingReviews.length,
                },
            })
        } else {
            await prisma.equipment.update({
                where: { id: review.equipmentId },
                data: {
                    rating: null,
                    reviewCount: 0,
                },
            })
        }

        revalidatePath(`/equipment/${review.equipment.slug}`)
        revalidatePath('/reviews')

        return {
            success: true,
            message: 'Отзыв успешно удален'
        }
    } catch (error: unknown) {
        console.error('Delete review error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось удалить отзыв' }
    }
}

// Получение всех отзывов для админки
export async function getAllReviews(filters?: {
    rating?: number
    verified?: boolean
    search?: string
    equipmentId?: string
    userId?: string
}): Promise<ActionResponse> {
    try {
        const where: any = {}

        if (filters?.rating) {
            where.rating = filters.rating
        }

        if (filters?.verified !== undefined) {
            where.isVerified = filters.verified
        }

        if (filters?.equipmentId) {
            where.equipmentId = filters.equipmentId
        }

        if (filters?.userId) {
            where.userId = filters.userId
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
                        name: { contains: filters.search }
                    }
                },
                { comment: { contains: filters.search } },
            ]
        }

        const reviews = await prisma.review.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                equipment: {
                    select: {
                        id: true,
                        name: true,
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

        return { success: true, data: reviews }
    } catch (error: any) {
        console.error('Get all reviews error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось загрузить отзывы'
        }
    }
}

// Обновление статуса верификации отзыва
export async function toggleReviewVerification(reviewId: string): Promise<ActionResponse> {
    try {
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                equipment: true,
            },
        })

        if (!review) {
            return { success: false, error: 'Отзыв не найден' }
        }

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                isVerified: !review.isVerified,
            },
        })

        revalidatePath('/admin/reviews')
        revalidatePath(`/equipment/${review.equipment.slug}`)

        return {
            success: true,
            data: updatedReview,
            message: `Отзыв ${updatedReview.isVerified ? 'верифицирован' : 'снята верификация'}`
        }
    } catch (error: any) {
        console.error('Toggle review verification error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось обновить статус отзыва'
        }
    }
}

// Получение статистики по отзывам
export async function getReviewStats(): Promise<ActionResponse> {
    try {
        const totalReviews = await prisma.review.count()
        const verifiedReviews = await prisma.review.count({ where: { isVerified: true } })
        const averageRating = await prisma.review.aggregate({
            _avg: { rating: true }
        })

        const ratingDistribution = await prisma.review.groupBy({
            by: ['rating'],
            _count: {
                rating: true,
            },
            orderBy: {
                rating: 'desc',
            },
        })

        const recentReviews = await prisma.review.findMany({
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
                totalReviews,
                verifiedReviews,
                averageRating: averageRating._avg.rating || 0,
                ratingDistribution,
                recentReviews
            }
        }
    } catch (error: any) {
        console.error('Get review stats error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось получить статистику'
        }
    }
}

// Удаление отзыва (для админа)
export async function adminDeleteReview(reviewId: string): Promise<ActionResponse> {
    try {
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                equipment: true,
            },
        })

        if (!review) {
            return { success: false, error: 'Отзыв не найден' }
        }

        await prisma.review.delete({
            where: { id: reviewId },
        })

        // Обновляем рейтинг оборудования
        const remainingReviews = await prisma.review.findMany({
            where: { equipmentId: review.equipmentId },
            select: { rating: true },
        })

        if (remainingReviews.length > 0) {
            const averageRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length

            await prisma.equipment.update({
                where: { id: review.equipmentId },
                data: {
                    rating: averageRating,
                    reviewCount: remainingReviews.length,
                },
            })
        } else {
            await prisma.equipment.update({
                where: { id: review.equipmentId },
                data: {
                    rating: null,
                    reviewCount: 0,
                },
            })
        }

        revalidatePath('/admin/reviews')
        revalidatePath(`/equipment/${review.equipment.slug}`)

        return {
            success: true,
            message: 'Отзыв удален'
        }
    } catch (error: any) {
        console.error('Admin delete review error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Не удалось удалить отзыв'
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