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

// Регистрация пользователя
export async function register(formData: FormData) {
    try {
        const validatedData = registerSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
            name: formData.get('name'),
            phone: formData.get('phone'),
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

        // Здесь можно добавить логику сессии/авторизации

        revalidatePath('/profile')

        return {
            success: true,
            data: { id: user.id, email: user.email, name: user.name },
            message: 'Регистрация успешна!'
        }
    } catch (error) {
        console.error('Register error:', error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: 'Не удалось зарегистрироваться' }
    }
}

// Авторизация
export async function login(formData: FormData) {
    try {
        const validatedData = loginSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
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

        // Здесь можно добавить создание сессии/JWT токена

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
    } catch (error) {
        console.error('Login error:', error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: 'Не удалось войти' }
    }
}

// Получение профиля пользователя
export async function getUserProfile(userId: string) {
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

        return { success: true, data: userWithoutPassword }
    } catch (error) {
        console.error('Get user profile error:', error)
        return { success: false, error: 'Не удалось загрузить профиль' }
    }
}

// Обновление профиля
export async function updateUserProfile(userId: string, formData: FormData) {
    try {
        const validatedData = updateProfileSchema.parse({
            name: formData.get('name'),
            phone: formData.get('phone'),
            avatar: formData.get('avatar'),
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
    } catch (error) {
        console.error('Update profile error:', error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: 'Не удалось обновить профиль' }
    }
}

// Выход
export async function logout() {
    // Здесь логика удаления сессии/токена
    revalidatePath('/')
    return { success: true, message: 'Выход выполнен' }
}