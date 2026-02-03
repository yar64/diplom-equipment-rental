// components/admin/AdminSidebar.tsx
'use client'

import {
    Home,
    Package,
    Users,
    Calendar,
    Folder,
    MessageSquare,
    Settings,
    BarChart3,
    CreditCard,
    Database,
    FileText,
    LineChart,
    Layers,
    ClipboardList
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
    {
        title: 'Обзор',
        items: [
            { href: '/admin', icon: Home, label: 'Панель управления' },
            { href: '/admin/analytics', icon: BarChart3, label: 'Аналитика' },
        ]
    },
    {
        title: 'Инвентарь',
        items: [
            { href: '/admin/equipment', icon: Package, label: 'Оборудование', count: 24 },
            { href: '/admin/categories', icon: Folder, label: 'Категории', count: 8 },
            { href: '/admin/inventory', icon: Layers, label: 'Инвентарь', count: 28 },
        ]
    },
    {
        title: 'Операции',
        items: [
            { href: '/admin/bookings', icon: Calendar, label: 'Бронирования', count: 156 },
            { href: '/admin/active', icon: ClipboardList, label: 'Активные аренды', count: 23 },
            { href: '/admin/payments', icon: CreditCard, label: 'Платежи' },
        ]
    },
    {
        title: 'Пользователи',
        items: [
            { href: '/admin/users', icon: Users, label: 'Пользователи', count: 89 },
            { href: '/admin/reviews', icon: MessageSquare, label: 'Отзывы', count: 42 },
        ]
    },
    {
        title: 'Система',
        items: [
            { href: '/admin/database', icon: Database, label: 'База данных' },
            { href: '/admin/settings', icon: Settings, label: 'Настройки' },
        ]
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background animate-pulse">
                <div className="p-6 border-b border-border">
                    <div className="h-8 bg-muted rounded"></div>
                </div>
            </aside>
        )
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background/80 backdrop-blur-sm overflow-y-auto">
            {/* Логотип */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3 animate-fade-in">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Аренда<span className="text-muted-foreground">Админ</span></h1>
                        <p className="text-xs text-muted-foreground">Управление оборудованием</p>
                    </div>
                </div>
            </div>

            <nav className="p-4 space-y-8">
                {navItems.map((section, sectionIndex) => (
                    <div key={section.title} className="animate-slide-in" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
                        <h3 className="px-3 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <ul className="space-y-1">
                            {section.items.map((item, itemIndex) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href ||
                                    (item.href !== '/admin' && pathname?.startsWith(item.href))

                                return (
                                    <li key={item.href} className="animate-fade-in" style={{ animationDelay: `${(sectionIndex * 100) + (itemIndex * 50)}ms` }}>
                                        <Link
                                            href={item.href}
                                            className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-smooth
                        ${isActive
                                                    ? 'bg-accent text-accent-foreground font-medium'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                                }
                      `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="flex-1">{item.label}</span>
                                            {item.count !== undefined && (
                                                <span className={`
                          px-2 py-0.5 text-xs rounded-full transition-smooth
                          ${isActive
                                                        ? 'bg-background text-foreground'
                                                        : 'bg-muted text-muted-foreground'
                                                    }
                        `}>
                                                    {item.count}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Статус */}
            <div className="p-4 mt-8 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">Статус системы</div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping-slow"></div>
                    <span className="text-sm">Все системы работают</span>
                </div>
            </div>
        </aside>
    )
}