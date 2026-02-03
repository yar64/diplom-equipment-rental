// app/admin/categories/create/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Folder } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '../../../components/admin/Button'
import { Input } from '../../../components/admin/Input'
import { Select } from '../../../components/admin/Select'
import { createCategory, getCategories } from '@/server/actions/category.actions'

export default function CreateCategoryPage() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [parentCategories, setParentCategories] = useState<Array<{ value: string, label: string }>>([])
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentId: type === 'child' ? '' : undefined
    })

    useEffect(() => {
        loadParentCategories()
    }, [])

    const loadParentCategories = async () => {
        const result = await getCategories()
        if (result.success && result.data) {
            const options = result.data.map(cat => ({
                value: cat.id,
                label: cat.name
            }))
            setParentCategories(options)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const result = await createCategory(formData)

        if (result.success) {
            window.location.href = '/admin/categories'
        } else {
            alert(result.error || 'Ошибка при создании категории')
            setIsSubmitting(false)
        }
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
                    {type === 'child' ? 'Добавить подкатегорию' : 'Добавить категорию'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    Создайте новую категорию для организации оборудования
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

                        {type === 'child' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Родительская категория *
                                </label>
                                <Select
                                    value={formData.parentId || ''}
                                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                                    options={parentCategories}
                                    placeholder="Выберите родительскую категорию"
                                    required
                                />
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

                {/* Подсказка */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <div className="flex items-start gap-3">
                        <Folder className="w-5 h-5 text-primary mt-0.5" />
                        <div className="space-y-2">
                            <h3 className="font-semibold">Рекомендации</h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Используйте четкие и понятные названия</li>
                                <li>• Описание поможет пользователям понять, что включает категория</li>
                                <li>• Создавайте иерархическую структуру для удобной навигации</li>
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
                        {isSubmitting ? 'Создание...' : 'Создать категорию'}
                    </Button>
                </div>
            </form>
        </div>
    )
}