// app/admin/inventory/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
    Package, AlertTriangle, CheckCircle, XCircle,
    TrendingUp, BarChart3, History, RefreshCw,
    Plus, Minus, Eye, Filter, Download
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/shared/utils'
import {
    getInventorySummary,
    getInventoryHistory,
    updateEquipmentQuantity
} from '@/server/actions/inventory.actions'

// Типы
interface InventorySummary {
    summary: {
        totalEquipment: number
        totalItems: number
        availableEquipment: number
        lowStockEquipment: number
        outOfStockEquipment: number
    }
    categories: Array<{
        name: string
        itemCount: number
        bookingCount: number
    }>
    lowStockItems: Array<{
        id: string
        name: string
        quantity: number
        pricePerDay: number
        category: { name: string }
    }>
    recentlyAdded: Array<{
        id: string
        name: string
        quantity: number
        createdAt: string
        category: { name: string }
    }>
}

interface HistoryItem {
    id: string
    type: string
    equipmentName: string
    userName: string
    date: string
    status: string
    details: string
}

export default function InventoryPage() {
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [summary, setSummary] = useState<InventorySummary | null>(null)
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [activeTab, setActiveTab] = useState<'summary' | 'lowstock' | 'history'>('summary')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [summaryResult, historyResult] = await Promise.all([
                getInventorySummary(),
                getInventoryHistory()
            ])

            if (summaryResult.success) {
                setSummary(summaryResult.data as InventorySummary)
            }

            if (historyResult.success) {
                setHistory(historyResult.data as HistoryItem[])
            }
        } catch (error) {
            console.error('Error loading inventory data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateQuantity = async (equipmentId: string, change: number) => {
        if (!summary) return

        const item = summary.lowStockItems.find(item => item.id === equipmentId)
        if (!item) return

        const newQuantity = Math.max(0, item.quantity + change)

        setUpdating(equipmentId)
        try {
            const result = await updateEquipmentQuantity(equipmentId, newQuantity)
            if (result.success) {
                await loadData() // Перезагружаем данные
            } else {
                alert(result.error || 'Ошибка обновления')
            }
        } catch (error) {
            console.error('Error updating quantity:', error)
            alert('Ошибка обновления количества')
        } finally {
            setUpdating(null)
        }
    }

    const handleExport = () => {
        alert('Экспорт данных инвентаря в разработке...')
    }

    const getStatusColor = (quantity: number) => {
        if (quantity === 0) return 'bg-red-500'
        if (quantity <= 2) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getStatusText = (quantity: number) => {
        if (quantity === 0) return 'Нет в наличии'
        if (quantity <= 2) return 'Мало'
        return 'В наличии'
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Инвентарь</h1>
                        <div className="h-4 w-64 bg-muted rounded animate-pulse mt-1"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border border-border rounded-lg p-4">
                            <div className="h-8 bg-muted rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопки */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Управление инвентарем</h1>
                    <p className="text-muted-foreground mt-1">
                        Контроль запасов и доступности оборудования
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Обновить
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Экспорт
                    </button>
                </div>
            </div>

            {/* Основные показатели */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Всего единиц</div>
                            <div className="text-2xl font-bold mt-1">
                                {summary?.summary.totalItems || 0}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {summary?.summary.totalEquipment} позиций
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Package className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Доступно</div>
                            <div className="text-2xl font-bold mt-1">
                                {summary?.summary.availableEquipment || 0}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {summary && summary.summary.totalEquipment > 0
                                    ? Math.round((summary.summary.availableEquipment / summary.summary.totalEquipment) * 100)
                                    : 0
                                }% доступно
                            </div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Мало на складе</div>
                            <div className="text-2xl font-bold mt-1">
                                {summary?.summary.lowStockEquipment || 0}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Требуют пополнения
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Нет в наличии</div>
                            <div className="text-2xl font-bold mt-1">
                                {summary?.summary.outOfStockEquipment || 0}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Закончились
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Табы */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-4 py-3 font-medium text-sm transition-colors ${activeTab === 'summary'
                            ? 'text-foreground border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Сводка
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('lowstock')}
                    className={`px-4 py-3 font-medium text-sm transition-colors ${activeTab === 'lowstock'
                            ? 'text-foreground border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Мало на складе
                        {summary && summary.lowStockItems.length > 0 && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {summary.lowStockItems.length}
                            </span>
                        )}
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-3 font-medium text-sm transition-colors ${activeTab === 'history'
                            ? 'text-foreground border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        История
                    </div>
                </button>
            </div>

            {/* Контент табов */}
            <div className="mt-6">
                {activeTab === 'summary' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Распределение по категориям */}
                        <div className="border border-border rounded-lg bg-background p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Распределение по категориям</h2>
                                <Link
                                    href="/admin/categories"
                                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    Все категории →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {summary?.categories.map((category, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">{category.itemCount} шт.</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {category.bookingCount} заказов
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${summary ? (category.itemCount / summary.summary.totalItems) * 100 : 0}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Недавно добавленное */}
                        <div className="border border-border rounded-lg bg-background p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Недавно добавленное</h2>
                                <Link
                                    href="/admin/equipment"
                                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    Все оборудование →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {summary?.recentlyAdded.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 border border-input rounded-lg">
                                        <div>
                                            <div className="font-medium text-sm">{item.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.category.name} • {formatDate(item.createdAt)}
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(item.quantity)}`}>
                                            {item.quantity} шт.
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'lowstock' && (
                    <div className="border border-border rounded-lg bg-background overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Оборудование с низким запасом</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Требует пополнения или внимания
                                    </p>
                                </div>
                                <Filter className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-border bg-muted/50">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-sm">Оборудование</th>
                                        <th className="text-left py-3 px-4 font-medium text-sm">Категория</th>
                                        <th className="text-left py-3 px-4 font-medium text-sm">Количество</th>
                                        <th className="text-left py-3 px-4 font-medium text-sm">Статус</th>
                                        <th className="text-left py-3 px-4 font-medium text-sm">Цена/день</th>
                                        <th className="text-left py-3 px-4 font-medium text-sm">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {summary?.lowStockItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-xs text-muted-foreground">ID: {item.id.slice(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                                    {item.category.name}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-2xl font-bold">{item.quantity}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(item.quantity)}`}>
                                                    {getStatusText(item.quantity)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium">{item.pricePerDay?.toLocaleString('ru-RU')} ₽</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, -1)}
                                                        disabled={updating === item.id || item.quantity <= 0}
                                                        className="p-1.5 border border-input rounded hover:bg-accent transition-colors disabled:opacity-50"
                                                        title="Уменьшить"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, 1)}
                                                        disabled={updating === item.id}
                                                        className="p-1.5 border border-input rounded hover:bg-accent transition-colors disabled:opacity-50"
                                                        title="Увеличить"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={`/admin/equipment/${item.id}`}
                                                        className="p-1.5 border border-input rounded hover:bg-accent transition-colors"
                                                        title="Просмотр"
                                                    >
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="border border-border rounded-lg bg-background">
                        <div className="px-6 py-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">История инвентаря</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Последние изменения и активность
                                    </p>
                                </div>
                                <button
                                    onClick={loadData}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Обновить
                                </button>
                            </div>
                        </div>
                        <div className="divide-y divide-border">
                            {history.map((item) => (
                                <div key={item.id} className="px-6 py-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{item.equipmentName}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {item.userName} • {formatDate(item.date)}
                                            </p>
                                            <p className="text-sm mt-1">{item.details}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                                                item.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                                                    item.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {item.status === 'PENDING' ? 'ожидает' :
                                                item.status === 'CONFIRMED' ? 'подтвержден' :
                                                    item.status === 'COMPLETED' ? 'завершен' :
                                                        item.status === 'CANCELLED' ? 'отменен' : item.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Быстрые действия */}
            <div className="border border-border rounded-lg bg-background p-6">
                <h2 className="text-lg font-semibold mb-4">Управление инвентарем</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/equipment/create"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Plus className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="font-medium">Добавить оборудование</div>
                                <div className="text-sm text-muted-foreground">Новая позиция в каталог</div>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <div className="font-medium">Управление категориями</div>
                                <div className="text-sm text-muted-foreground">Организация инвентаря</div>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/admin/reports"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Download className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="font-medium">Отчет по инвентарю</div>
                                <div className="text-sm text-muted-foreground">Полная статистика</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}