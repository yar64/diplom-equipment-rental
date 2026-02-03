// components/admin/AdminHeader.tsx
'use client'

import { Search, Bell, HelpCircle, User, Filter } from 'lucide-react'
import { useState } from 'react'

export default function AdminHeader() {
    const [search, setSearch] = useState('')

    return (
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="px-8 py-4">
                <div className="flex items-center justify-between gap-6">
                    {/* Поиск */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative animate-fade-in">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Поиск оборудования, клиентов, заказов..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground transition-smooth"
                            />
                        </div>
                    </div>

                    {/* Правая часть */}
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 border border-input rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth">
                            <Filter className="w-4 h-4" />
                        </button>

                        <button className="p-2.5 border border-input rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </button>

                        <button className="p-2.5 border border-input rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth">
                            <HelpCircle className="w-4 h-4" />
                        </button>

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