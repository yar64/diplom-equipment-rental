// app/admin/equipment/create/page.tsx
'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, Package } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../../components/admin/Button'
import { Input } from '../../../components/admin/Input'
import { Select } from '../../../components/admin/Select'

export default function CreateEquipmentPage() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        pricePerDay: '',
        quantity: '1',
        sku: '',
        brand: '',
        model: '',
        weight: '',
        dimensions: '',
        powerRequirements: '',
        isAvailable: true,
        requiresDelivery: false,
        requiresSetup: false
    })

    const categories = [
        { value: 'audio', label: 'Аудио оборудование' },
        { value: 'video', label: 'Видео оборудование' },
        { value: 'lighting', label: 'Световое оборудование' },
        { value: 'stage', label: 'Сценическое оборудование' },
        { value: 'furniture', label: 'Мебель и конструкции' },
        { value: 'other', label: 'Прочее оборудование' }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Здесь будет логика отправки данных
        console.log('Данные для создания:', formData)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Заголовок и навигация */}
            <div>
                <Link
                    href="/admin/equipment"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Назад к списку оборудования
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Добавить новое оборудование</h1>
                <p className="text-muted-foreground mt-1">
                    Заполните информацию о новом оборудовании для аренды
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Основная информация */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Название оборудования *</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Например: Микшерный пульт Yamaha CL5"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Категория *</label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                                options={categories}
                                placeholder="Выберите категорию"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Артикул (SKU)</label>
                            <Input
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                placeholder="EQ-AUD-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Количество *</label>
                            <Input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                min="1"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Цена за день (₽) *</label>
                            <Input
                                type="number"
                                value={formData.pricePerDay}
                                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                                placeholder="1500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium">Описание оборудования *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border border-input rounded-lg px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            placeholder="Подробное описание оборудования, технические характеристики..."
                            required
                        />
                    </div>
                </div>

                {/* Технические характеристики */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Технические характеристики</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Бренд</label>
                            <Input
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                placeholder="Yamaha"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Модель</label>
                            <Input
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                placeholder="CL5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Вес (кг)</label>
                            <Input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                placeholder="15.5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Габариты</label>
                            <Input
                                value={formData.dimensions}
                                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                placeholder="1200x800x200 мм"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Требования к питанию</label>
                            <Input
                                value={formData.powerRequirements}
                                onChange={(e) => setFormData({ ...formData, powerRequirements: e.target.value })}
                                placeholder="220V, 50Hz, 1500W"
                            />
                        </div>
                    </div>
                </div>

                {/* Дополнительные опции */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Дополнительные опции</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Доступно для аренды</div>
                                <div className="text-sm text-muted-foreground">Оборудование можно арендовать</div>
                            </div>
                            <div className="relative inline-block w-12 h-6">
                                <input
                                    type="checkbox"
                                    checked={formData.isAvailable}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                    className="opacity-0 w-0 h-0 peer"
                                    id="isAvailable"
                                />
                                <label
                                    htmlFor="isAvailable"
                                    className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-primary before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform peer-checked:before:translate-x-6"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Требуется доставка</div>
                                <div className="text-sm text-muted-foreground">Нужна специальная доставка</div>
                            </div>
                            <div className="relative inline-block w-12 h-6">
                                <input
                                    type="checkbox"
                                    checked={formData.requiresDelivery}
                                    onChange={(e) => setFormData({ ...formData, requiresDelivery: e.target.checked })}
                                    className="opacity-0 w-0 h-0 peer"
                                    id="requiresDelivery"
                                />
                                <label
                                    htmlFor="requiresDelivery"
                                    className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-primary before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform peer-checked:before:translate-x-6"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Требуется установка</div>
                                <div className="text-sm text-muted-foreground">Нужна профессиональная установка</div>
                            </div>
                            <div className="relative inline-block w-12 h-6">
                                <input
                                    type="checkbox"
                                    checked={formData.requiresSetup}
                                    onChange={(e) => setFormData({ ...formData, requiresSetup: e.target.checked })}
                                    className="opacity-0 w-0 h-0 peer"
                                    id="requiresSetup"
                                />
                                <label
                                    htmlFor="requiresSetup"
                                    className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-primary before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform peer-checked:before:translate-x-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center justify-between pt-6">
                    <Link href="/admin/equipment">
                        <Button variant="outline" type="button">
                            Отмена
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" type="button">
                            Сохранить как черновик
                        </Button>
                        <Button type="submit" className="gap-2">
                            <Package className="w-4 h-4" />
                            Добавить оборудование
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}