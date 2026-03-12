'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Folder, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '../../../../components/admin/Button'
import { Input } from '../../../../components/admin/Input'
import { Select } from '../../../../components/admin/Select'
import { getCategoryById, updateCategory, getCategories } from '@/server/actions/category.actions'

export default function EditCategoryPage() {
    const params = useParams()
    const categoryId = params.id as string

    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [parentCategories, setParentCategories] = useState<Array<{ value: string, label: string }>>([])
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentId: ''
    })
    const [originalCategory, setOriginalCategory] = useState<any>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            // Загружаем текущую категорию
            const categoryResult = await getCategoryById(categoryId)
            if (categoryResult.success && categoryResult.data) {
                setOriginalCategory(categoryResult.data)
                setFormData({
                    name: categoryResult.data.name,
                    description: categoryResult.data.description || '',
                    parentId: categoryResult.data.parentId || ''
                })
            } else {
                alert('Категория не найдена')
                window.location.href = '/admin/categories'
                return
            }

            // Загружаем список родительских категорий (исключая текущую и её дочерние)
            const categoriesResult = await getCategories()
            if (categoriesResult.success && categoriesResult.data) {
                // Фильтруем: нельзя выбрать себя или своих потомков
                const excludedIds = getDescendantIds(categoryId, categoriesResult.data)
                const options = categoriesResult.data
                    .filter(cat => cat.id !== categoryId && !excludedIds.includes(cat.id))
                    .map(cat => ({
                        value: cat.id,
                        label: cat.name
                    }))
                setParentCategories(options)
            }
        } catch (error) {
            console.error('Error loading category:', error)
            alert('Ошибка при загрузке категории')
        } finally {
            setIsLoading(false)
        }
    }

    // Функция для получения всех ID дочерних категорий
    const getDescendantIds = (id: string, allCategories: any[]): string[] => {
        const children = allCategories.filter(c => c.parentId === id)
        const descendantIds: string[] = []

        for (const child of children) {
            descendantIds.push(child.id)
            descendantIds.push(...getDescendantIds(child.id, allCategories))
        }

        return descendantIds
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const result = await updateCategory(categoryId, formData)

        if (result.success) {
            window.location.href = '/admin/categories'
        } else {
            alert(result.error || 'Ошибка при обновлении категории')
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Загрузка категории...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Заголовок и навигация */}
            <div>
                <Link
                    href="/admin/categories"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Назад к списку категорий
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">
                    Редактирование категории
                </h1>
                <p className="text-muted-foreground mt-1">
                    Измените информацию о категории "{originalCategory?.name}"
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Основная информация */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Информация о категории</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Название категории *
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Например: Аудио оборудование"
                                required
                            />
                        </div>

                        {parentCategories.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Родительская категория
                                </label>
                                <Select
                                    value={formData.parentId}
                                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                                    options={parentCategories}
                                    placeholder="Нет (основная категория)"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Нельзя выбрать текущую категорию или её подкатегории
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Описание
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-input rounded-lg px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                placeholder="Краткое описание категории..."
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Статистика категории (если есть) */}
                {originalCategory?._count && (
                    <div className="border border-border rounded-lg bg-background p-6">
                        <h3 className="font-semibold mb-3">Статистика</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Оборудования</div>
                                <div className="text-2xl font-bold">{originalCategory._count.equipment}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Подкатегорий</div>
                                <div className="text-2xl font-bold">{originalCategory._count.children}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Подсказка */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <div className="flex items-start gap-3">
                        <Folder className="w-5 h-5 text-primary mt-0.5" />
                        <div className="space-y-2">
                            <h3 className="font-semibold">Рекомендации</h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Изменение родительской категории переместит все подкатегории и оборудование</li>
                                <li>• Название должно быть уникальным в пределах одной родительской категории</li>
                                <li>• Slug будет автоматически обновлен при изменении названия</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center justify-between pt-6">
                    <Link href="/admin/categories">
                        <Button variant="outline" type="button">
                            Отмена
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </div>
            </form>
        </div>
    )
}