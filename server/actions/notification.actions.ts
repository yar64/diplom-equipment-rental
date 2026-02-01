// server/actions/notification.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'

// Получение уведомлений пользователя
export async function getUserNotifications(userId: string, unreadOnly: boolean = false) {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly && { read: false }),
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        })

        return { success: true, data: notifications }
    } catch (error: unknown) {
        console.error('Get notifications error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить уведомления' }
    }
}

// Отметить уведомление как прочитанное
export async function markNotificationAsRead(notificationId: string, userId: string) {
    try {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        })

        if (!notification) {
            return { success: false, error: 'Уведомление не найдено' }
        }

        if (notification.userId !== userId) {
            return { success: false, error: 'Недостаточно прав' }
        }

        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        })

        revalidatePath('/notifications')
        revalidatePath('/profile')

        return { success: true, message: 'Уведомление отмечено как прочитанное' }
    } catch (error: unknown) {
        console.error('Mark notification as read error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось обновить уведомление' }
    }
}

// Отметить все уведомления как прочитанные
export async function markAllNotificationsAsRead(userId: string) {
    try {
        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        })

        revalidatePath('/notifications')
        revalidatePath('/profile')

        return { success: true, message: 'Все уведомления отмечены как прочитанные' }
    } catch (error: unknown) {
        console.error('Mark all notifications as read error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось обновить уведомления' }
    }
}