// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Пути, которые требуют авторизации админа
const adminPaths = ['/admin']

// Временная проверка - в реальном проекте здесь должна быть проверка сессии/токена
function isAdmin(request: NextRequest): boolean {
    // Пока возвращаем true для разработки
    // В production нужно проверять через cookies/session
    return true
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Проверяем, если путь начинается с /admin
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path))

    if (isAdminPath && !isAdmin(request)) {
        // Редирект на логин если не админ
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// Настройки middleware
export const config = {
    matcher: [
        '/admin/:path*',
        // Можно добавить другие защищенные пути
    ]
}