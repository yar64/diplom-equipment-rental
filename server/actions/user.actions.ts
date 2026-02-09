// server/actions/user.actions.ts
'use server'

import prisma from '../utils/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Валидация схем
const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

const registerSchema = loginSchema.extend({
    name: z.string().min(2, 'Имя слишком короткое'),
    phone: z.string().optional(),
})

const updateProfileSchema = z.object({
    name: z.string().min(2, 'Имя слишком короткое').optional(),
    phone: z.string().optional(),
    avatar: z.string().url('Некорректный URL').optional(),
})

// Тип для ответа
interface ActionResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Тип для пользователя без пароля
interface UserProfile {
    id: string
    email: string
    name?: string | null
    phone?: string | null
    avatar?: string | null
    role: string
    createdAt: Date
    updatedAt: Date
    bookings?: any[]
    favorites?: any[]
}

// Вспомогательная функция для обработки ошибок Zod
function getZodErrorMessage(error: unknown): string {
    if (error instanceof z.ZodError) {
        // Используем type assertion для доступа к errors
        const zodError = error as { errors?: Array<{ message?: string }> }
        if (zodError.errors && zodError.errors.length > 0 && zodError.errors[0].message) {
            return zodError.errors[0].message
        }
    }
    return 'Ошибка валидации'
}

// Регистрация пользователя
export async function register(formData: FormData): Promise<ActionResponse> {
    try {
        const rawData = {
            email: formData.get('email'),
            password: formData.get('password'),
            name: formData.get('name'),
            phone: formData.get('phone'),
        }

        const validatedData = registerSchema.parse({
            ...rawData,
            email: String(rawData.email),
            password: String(rawData.password),
            name: String(rawData.name),
            phone: rawData.phone ? String(rawData.phone) : undefined,
        })

        // Проверяем, существует ли пользователь
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return { success: false, error: 'Пользователь с таким email уже существует' }
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)

        // Создаем пользователя
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                phone: validatedData.phone,
            },
        })

        revalidatePath('/profile')

        return {
            success: true,
            data: { id: user.id, email: user.email, name: user.name },
            message: 'Регистрация успешна!'
        }
    } catch (error: unknown) {
        console.error('Register error:', error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: getZodErrorMessage(error)
            }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось зарегистрироваться' }
    }
}

// Авторизация
export async function login(formData: FormData): Promise<ActionResponse> {
    try {
        const rawData = {
            email: formData.get('email'),
            password: formData.get('password'),
        }

        const validatedData = loginSchema.parse({
            ...rawData,
            email: String(rawData.email),
            password: String(rawData.password),
        })

        // Ищем пользователя
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (!user) {
            return { success: false, error: 'Неверный email или пароль' }
        }

        // Проверяем пароль
        const passwordValid = await bcrypt.compare(validatedData.password, user.password)

        if (!passwordValid) {
            return { success: false, error: 'Неверный email или пароль' }
        }

        revalidatePath('/profile')

        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
            },
            message: 'Вход выполнен успешно!'
        }
    } catch (error: unknown) {
        console.error('Login error:', error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: getZodErrorMessage(error)
            }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось войти' }
    }
}

// Получение профиля пользователя
export async function getUserProfile(userId: string): Promise<ActionResponse<UserProfile>> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                bookings: {
                    include: {
                        equipment: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10,
                },
                favorites: {
                    include: {
                        equipment: {
                            include: {
                                category: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        })

        if (!user) {
            return { success: false, error: 'Пользователь не найден' }
        }

        // Не возвращаем пароль
        const { password, ...userWithoutPassword } = user

        return {
            success: true,
            data: userWithoutPassword as UserProfile
        }
    } catch (error: unknown) {
        console.error('Get user profile error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить профиль' }
    }
}

// Обновление профиля
export async function updateUserProfile(
    userId: string,
    formData: FormData
): Promise<ActionResponse> {
    try {
        const rawData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            avatar: formData.get('avatar'),
        }

        const validatedData = updateProfileSchema.parse({
            ...rawData,
            name: rawData.name ? String(rawData.name) : undefined,
            phone: rawData.phone ? String(rawData.phone) : undefined,
            avatar: rawData.avatar ? String(rawData.avatar) : undefined,
        })

        const user = await prisma.user.update({
            where: { id: userId },
            data: validatedData,
        })

        revalidatePath('/profile')

        return {
            success: true,
            data: {
                name: user.name,
                phone: user.phone,
                avatar: user.avatar
            },
            message: 'Профиль успешно обновлен'
        }
    } catch (error: unknown) {
        console.error('Update profile error:', error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: getZodErrorMessage(error)
            }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось обновить профиль' }
    }
}

// Выход
export async function logout(): Promise<ActionResponse> {
    revalidatePath('/')
    return { success: true, message: 'Выход выполнен' }
}

// Тип для фильтров пользователей
interface UserFilters {
    role?: string
    search?: string
}

// Получение пользователей
export async function getUsers(
    filters?: UserFilters
): Promise<ActionResponse> {
    try {
        const where: any = {}

        if (filters?.role) {
            where.role = filters.role
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { email: { contains: filters.search } },
            ]
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        bookings: true,
                        favorites: true,
                        reviews: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return { success: true, data: users }
    } catch (error: unknown) {
        console.error('Get users error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось загрузить пользователей' }
    }
}

// Изменение роли пользователя (для админа)
export async function updateUserRole(
    userId: string,
    newRole: string
): Promise<ActionResponse> {
    try {
        const validRoles = ['ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER']

        if (!validRoles.includes(newRole)) {
            return { success: false, error: 'Некорректная роль' }
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        })

        revalidatePath('/admin/users')

        return {
            success: true,
            data: user,
            message: `Роль пользователя изменена на "${newRole}"`
        }
    } catch (error: any) {
        console.error('Update user role error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось изменить роль пользователя' }
    }
}

// Удаление пользователя (для админа)
export async function deleteUser(userId: string): Promise<ActionResponse> {
    try {
        // Проверяем, есть ли активные бронирования
        const activeBookings = await prisma.booking.count({
            where: {
                userId,
                status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] }
            }
        })

        if (activeBookings > 0) {
            return {
                success: false,
                error: 'Нельзя удалить пользователя с активными бронированиями'
            }
        }

        await prisma.user.delete({
            where: { id: userId }
        })

        revalidatePath('/admin/users')

        return {
            success: true,
            message: 'Пользователь удален'
        }
    } catch (error: any) {
        console.error('Delete user error:', error)

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: 'Не удалось удалить пользователя' }
    }
}