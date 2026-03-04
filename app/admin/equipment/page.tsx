// app/admin/equipment/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
    Package, Plus, Edit, Trash2, Eye, Filter, Search,
    ChevronDown, MoreHorizontal, CheckCircle, XCircle,
    Star, Image as ImageIcon, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getEquipment, deleteEquipment } from '@/server/actions/equipment.actions'
import { getCategories } from '@/server/actions/category.actions'
import { Equipment } from '@/shared/types'
import { formatDate } from '@/shared/utils'
import Button from '../../components/ui/Button'

interface EquipmentItem {
    id: string
    name: string
    slug: string
    description?: string | null
    fullDescription?: string | null
    pricePerDay: number
    pricePerWeek?: number | null
    pricePerMonth?: number | null
    quantity: number
    available: boolean
    featured: boolean
    rating?: number | null
    reviewCount: number
    images: string
    mainImage?: string | null
    powerRequirements?: string | null
    weight?: number | null
    dimensions?: string | null
    brand?: string | null
    model?: string | null
    serialNumber?: string | null
    categoryId: string
    createdAt: Date
    updatedAt: Date
    category: {
        id: string
        name: string
    } | null
    _count?: {
        bookings: number
        reviews: number
    }
}

export default function EquipmentPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [equipment, setEquipment] = useState<EquipmentItem[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
        open: false,
        id: '',
        name: ''
    })

    // Фильтры из URL
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        categoryId: searchParams.get('categoryId') || '',
        available: searchParams.get('available') || '',
        featured: searchParams.get('featured') || '',
    })

    // Загрузка категорий при монтировании
    useEffect(() => {
        loadCategories()
    }, [])

    // Загрузка оборудования при изменении фильтров или URL
    useEffect(() => {
        loadEquipment()
    }, [searchParams])

    const loadCategories = async () => {
        try {
            const result = await getCategories()
            if (result.success && Array.isArray(result.data)) {
                setCategories(result.data)
            }
        } catch (error) {
            console.error('Error loading categories:', error)
        }
    }

    const loadEquipment = async () => {
        setLoading(true)
        try {
            // Берем фильтры напрямую из URL
            const urlFilters = {
                search: searchParams.get('search') || '',
                categoryId: searchParams.get('categoryId') || '',
                available: searchParams.get('available') || '',
                featured: searchParams.get('featured') || '',
            }

            console.log('🔍 Фильтры из URL:', urlFilters)

            const equipmentRes = await getEquipment({
                search: urlFilters.search || undefined,
                categoryId: urlFilters.categoryId || undefined,
                available: urlFilters.available || undefined,
                featured: urlFilters.featured || undefined,
            })

            console.log('📦 Результат:', equipmentRes)

            if (equipmentRes.success) {
                setEquipment(equipmentRes.data || [])
            }
        } catch (error) {
            console.error('Error loading equipment:', error)
        } finally {
            setLoading(false)
        }
    }

    // Обработка фильтров
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))

        // Обновляем URL
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/admin/equipment?${params.toString()}`)
    }

    const clearFilters = () => {
        router.push('/admin/equipment')
    }

    // Удаление оборудования
    const handleDelete = async () => {
        try {
            const result = await deleteEquipment(deleteDialog.id)
            if (result.success) {
                setEquipment(prev => prev.filter(item => item.id !== deleteDialog.id))
                setDeleteDialog({ open: false, id: '', name: '' })
            } else {
                alert(result.error || 'Ошибка при удалении')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Ошибка при удалении')
        }
    }

    // Статистика
    const stats = {
        total: equipment.length,
        available: equipment.filter(e => e.available).length,
        featured: equipment.filter(e => e.featured).length,
        lowStock: equipment.filter(e => e.quantity < 3).length,
    }

    return (
        <div className="space-y-6">
            {/* Заголовок и действия */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Оборудование</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление всем оборудованием для аренды
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedItems.length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => alert('Массовое удаление будет добавлено позже')}
                            size="sm"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Удалить ({selectedItems.length})
                        </Button>
                    )}
                    <Link href="/admin/equipment/create">
                        <Button variant="primary" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Добавить оборудование
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Всего единиц</div>
                            <div className="text-2xl font-bold mt-1">{stats.total}</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Package className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Доступно сейчас</div>
                            <div className="text-2xl font-bold mt-1">{stats.available}</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Рекомендуемые</div>
                            <div className="text-2xl font-bold mt-1">{stats.featured}</div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Мало на складе</div>
                            <div className="text-2xl font-bold mt-1">{stats.lowStock}</div>
                        </div>
                        <div className="p-3 bg-orange-500/10 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="border border-border rounded-lg bg-background p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Поиск */}
                    <div className="md:col-span-5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Поиск по названию, описанию, бренду..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                            />
                        </div>
                    </div>

                    {/* Категории */}
                    <div className="md:col-span-3">
                        <select
                            value={filters.categoryId}
                            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                            className="w-full border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        >
                            <option value="">Все категории</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Статус доступности */}
                    <div className="md:col-span-2">
                        <select
                            value={filters.available}
                            onChange={(e) => handleFilterChange('available', e.target.value)}
                            className="w-full border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        >
                            <option value="">Все статусы</option>
                            <option value="true">Доступно</option>
                            <option value="false">Недоступно</option>
                        </select>
                    </div>

                    {/* Рекомендуемые */}
                    <div className="md:col-span-2 flex gap-2">
                        <select
                            value={filters.featured}
                            onChange={(e) => handleFilterChange('featured', e.target.value)}
                            className="w-full border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        >
                            <option value="">Все</option>
                            <option value="true">Рекомендуемые</option>
                            <option value="false">Обычные</option>
                        </select>

                        {/* Кнопка сброса */}
                        {(filters.search || filters.categoryId || filters.available || filters.featured) && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2.5 border border-input rounded-lg hover:bg-accent text-sm whitespace-nowrap"
                                title="Сбросить фильтры"
                            >
                                Сбросить
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Таблица оборудования */}
            <div className="border border-border rounded-lg bg-background overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="w-8 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === equipment.length && equipment.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedItems(equipment.map(e => e.id))
                                            } else {
                                                setSelectedItems([])
                                            }
                                        }}
                                        className="rounded border-input"
                                    />
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Оборудование</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Категория</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Цена/день</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Количество</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Статус</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Рейтинг</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Добавлено</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="py-8 text-center">
                                        <div className="animate-pulse text-muted-foreground">
                                            Загрузка оборудования...
                                        </div>
                                    </td>
                                </tr>
                            ) : equipment.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-muted-foreground">
                                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-lg font-medium">Оборудование не найдено</p>
                                        <p className="text-sm mt-1">Попробуйте изменить параметры фильтрации</p>
                                    </td>
                                </tr>
                            ) : (
                                equipment.map((item) => (
                                    <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedItems([...selectedItems, item.id])
                                                    } else {
                                                        setSelectedItems(selectedItems.filter(id => id !== item.id))
                                                    }
                                                }}
                                                className="rounded border-input"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    {item.mainImage ? (
                                                        <img
                                                            src={item.mainImage}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-primary" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        ID: {item.id.slice(0, 8)}
                                                    </div>
                                                    {item.brand && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {item.brand} {item.model}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm">{item.category?.name || 'Без категории'}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-medium">{item.pricePerDay.toLocaleString()} ₽</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={item.quantity < 3 ? 'text-orange-500 font-medium' : ''}>
                                                {item.quantity} шт.
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                {item.available ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="text-sm text-green-600">Доступно</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm text-red-600">Недоступно</span>
                                                    </>
                                                )}
                                                {item.featured && (
                                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                                                        Хит
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">{item.rating || 0}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({item.reviewCount || 0})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm">{formatDate(item.createdAt)}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <Link href={`/admin/equipment/${item.id}/edit`}>
                                                    <button className="p-1.5 hover:bg-accent rounded-md transition-colors" title="Редактировать">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={`/catalog/${item.slug}`} target="_blank">
                                                    <button className="p-1.5 hover:bg-accent rounded-md transition-colors" title="Просмотр на сайте">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteDialog({
                                                        open: true,
                                                        id: item.id,
                                                        name: item.name
                                                    })}
                                                    className="p-1.5 hover:bg-accent rounded-md transition-colors hover:text-red-500"
                                                    title="Удалить"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Пагинация (заглушка) */}
                <div className="border-t border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Показано {equipment.length} записей
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 border border-input rounded text-sm hover:bg-accent transition-colors">
                                Назад
                            </button>
                            <button className="px-3 py-1 border border-input rounded text-sm bg-accent font-medium">
                                1
                            </button>
                            <button className="px-3 py-1 border border-input rounded text-sm hover:bg-accent transition-colors">
                                Далее
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Диалог подтверждения удаления */}
            {deleteDialog.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-2">Подтверждение удаления</h3>
                        <p className="text-muted-foreground mb-6">
                            Вы уверены, что хотите удалить оборудование "{deleteDialog.name}"?
                            Это действие нельзя отменить.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialog({ open: false, id: '', name: '' })}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}