'use client'

import { useState, useEffect } from 'react'
import { getCategories } from '@/server/actions/category.actions'
import { Folder, Plus, ChevronRight, Package, FolderTree, Search, X } from 'lucide-react'
import Link from 'next/link'
import Button from '../../components/ui/Button'
import { Input } from '../../components/admin/Input'
import CategoryActions from '../../components/admin/CategoryActions'
import type { CategoryWithStats } from '@/server/actions/category.actions'

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryWithStats[]>([])
    const [filteredCategories, setFilteredCategories] = useState<CategoryWithStats[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState('all')

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        filterCategories()
    }, [searchQuery, filterType, categories])

    const loadCategories = async () => {
        setLoading(true)
        try {
            const result = await getCategories()
            if (result.success && result.data) {
                setCategories(result.data)
            }
        } catch (error) {
            console.error('Error loading categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterCategories = () => {
        let filtered = [...categories]

        // Поиск по названию
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(cat =>
                cat.name.toLowerCase().includes(query) ||
                (cat.description?.toLowerCase() || '').includes(query)
            )
        }

        // Фильтр по типу
        switch (filterType) {
            case 'root':
                filtered = filtered.filter(cat => !cat.parentId)
                break
            case 'with-children':
                filtered = filtered.filter(cat => cat._count?.children && cat._count.children > 0)
                break
            case 'empty':
                filtered = filtered.filter(cat => !cat._count?.equipment || cat._count.equipment === 0)
                break
        }

        setFilteredCategories(filtered)
    }

    const handleDelete = (deletedId: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== deletedId))
    }

    // Группируем категории
    const rootCategories = filteredCategories.filter(c => !c.parentId)
    const childCategories = filteredCategories.filter(c => c.parentId)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-pulse text-center">
                    <Folder className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">Загрузка категорий...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопка добавления */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Категории оборудования</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление категориями для организации оборудования
                    </p>
                </div>
                <Link href="/admin/categories/create">
                    <Button variant="primary" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Добавить категорию
                    </Button>
                </Link>
            </div>

            {/* Панель поиска */}
            <div className="border border-border rounded-lg bg-background p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск по названию или описанию..."
                                className="pl-10 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <select
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">Все категории</option>
                            <option value="root">Только основные</option>
                            <option value="with-children">С дочерними</option>
                            <option value="empty">Без оборудования</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Список категорий */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Основные категории */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="border border-border rounded-lg bg-background overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Категории оборудования</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Всего категорий: {filteredCategories.length}
                                        {filteredCategories.length !== categories.length &&
                                            ` (отфильтровано из ${categories.length})`
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FolderTree className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm">
                                        {rootCategories.length} основных
                                    </span>
                                </div>
                            </div>
                        </div>

                        {filteredCategories.length === 0 ? (
                            <div className="px-6 py-12 text-center text-muted-foreground">
                                <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-lg font-medium">Категории не найдены</p>
                                <p className="text-sm mt-1">Попробуйте изменить параметры поиска</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {rootCategories.map((category) => {
                                    const children = childCategories.filter(c => c.parentId === category.id)

                                    return (
                                        <div key={category.id}>
                                            {/* Основная категория */}
                                            <div className="px-6 py-4 hover:bg-accent/50 transition-colors group">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                            <Folder className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{category.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {category.description || 'Нет описания'}
                                                            </div>
                                                            {children.length > 0 && (
                                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                                    <ChevronRight className="w-3 h-3" />
                                                                    <span>{children.length} подкатегорий</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Package className="w-4 h-4 text-muted-foreground" />
                                                                <span>{category._count?.equipment || 0}</span>
                                                            </div>
                                                        </div>
                                                        <CategoryActions
                                                            category={category}
                                                            onDelete={() => handleDelete(category.id)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Дочерние категории */}
                                            {children.length > 0 && (
                                                <div className="pl-16 bg-muted/30">
                                                    {children.map((child) => (
                                                        <div
                                                            key={child.id}
                                                            className="px-6 py-3 hover:bg-accent/30 transition-colors border-t border-border/50"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                                                                        <Folder className="w-4 h-4 text-muted-foreground" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-sm">{child.name}</div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            {child.description || 'Нет описания'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {child._count?.equipment || 0} шт.
                                                                    </div>
                                                                    <CategoryActions
                                                                        category={child}
                                                                        onDelete={() => handleDelete(child.id)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Статистика */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">Всего категорий</div>
                                    <div className="text-2xl font-bold mt-1">{categories.length}</div>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <Folder className="w-5 h-5 text-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">Основные категории</div>
                                    <div className="text-2xl font-bold mt-1">
                                        {categories.filter(c => !c.parentId).length}
                                    </div>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <FolderTree className="w-5 h-5 text-green-500" />
                                </div>
                            </div>
                        </div>
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">Дочерние категории</div>
                                    <div className="text-2xl font-bold mt-1">
                                        {categories.filter(c => c.parentId).length}
                                    </div>
                                </div>
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <div className="w-5 h-5 text-purple-500">
                                        <Folder className="w-4 h-4" />
                                        <ChevronRight className="w-3 h-3 -ml-1 -mt-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Боковая панель (без изменений) */}
                <div className="space-y-6">
                    {/* ... остальной код боковой панели без изменений ... */}
                </div>
            </div>
        </div>
    )
}