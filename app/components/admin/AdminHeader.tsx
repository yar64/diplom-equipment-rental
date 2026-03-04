// components/admin/AdminHeader.tsx
'use client'

import { HelpCircle, User } from 'lucide-react'
import GlobalSearch from './GlobalSearch'
import NotificationDropdown from './NotificationDropdown'
import FilterDropdown from './FilterDropdown'

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="px-8 py-4">
                <div className="flex items-center justify-between gap-6">
                    {/* Поиск */}
                    <div className="flex-1 max-w-xl">
                        <GlobalSearch />
                    </div>

                    {/* Правая часть */}
                    <div className="flex items-center gap-3">
                        {/* Кнопка фильтра */}
                        <FilterDropdown />

                        {/* Уведомления */}
                        <NotificationDropdown />

                        {/* Кнопка помощи — УДАЛЕНА */}

                        <div className="h-6 w-px bg-border"></div>

                        <button className="flex items-center gap-3 p-2 border border-input rounded-lg hover:bg-accent transition-smooth">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium">Администратор</p>
                                <p className="text-xs text-muted-foreground">admin@arenda.ru</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Быстрая статистика */}
                <div className="mt-4 flex items-center gap-6 text-sm animate-fade-in-up">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-muted-foreground">Система: <span className="font-medium text-foreground">Работает</span></span>
                    </div>
                    <div className="h-4 w-px bg-border"></div>
                    <span className="text-muted-foreground">Оборудование: <span className="font-medium text-foreground">24/28 доступно</span></span>
                    <div className="h-4 w-px bg-border"></div>
                    <span className="text-muted-foreground">Сегодня: <span className="font-medium text-foreground">3 новых заказа</span></span>
                </div>
            </div>
        </header>
    )
}