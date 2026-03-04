// app/admin/equipment/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Package,
    Save,
    Upload,
    Trash2,
    AlertCircle,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { getEquipmentById, updateEquipment } from '@/server/actions/equipment.actions'
import { getCategories } from '@/server/actions/category.actions'
import { Equipment, Category } from '@/shared/types'
import Button from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'

export default function EditEquipmentPage() {
    const params = useParams()
    const router = useRouter()
    const equipmentId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [categories, setCategories] = useState<Category[]>([])

    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        description: '',
        fullDescription: '',
        pricePerDay: '',
        pricePerWeek: '',
        pricePerMonth: '',
        quantity: '1',
        sku: '',
        brand: '',
        model: '',
        weight: '',
        dimensions: '',
        powerRequirements: '',
        available: true,
        featured: false,
        mainImage: '',
        images: [] as string[],
    })

    // Загрузка данных оборудования и категорий
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const [equipmentRes, categoriesRes] = await Promise.all([
                    getEquipmentById(equipmentId),
                    getCategories()
                ])

                if (categoriesRes.success) {
                    setCategories((categoriesRes.data as Category[]) || [])
                }

                if (equipmentRes.success && equipmentRes.data) {
                    const eq = equipmentRes.data as Equipment
                    setFormData({
                        name: eq.name || '',
                        categoryId: eq.categoryId || '',
                        description: eq.description || '',
                        fullDescription: eq.fullDescription || '',
                        pricePerDay: eq.pricePerDay?.toString() || '',
                        pricePerWeek: eq.pricePerWeek?.toString() || '',
                        pricePerMonth: eq.pricePerMonth?.toString() || '',
                        quantity: eq.quantity?.toString() || '1',
                        sku: eq.serialNumber || '',
                        brand: eq.brand || '',
                        model: eq.model || '',
                        weight: eq.weight?.toString() || '',
                        dimensions: eq.dimensions || '',
                        powerRequirements: eq.powerRequirements || '',
                        available: eq.available ?? true,
                        featured: eq.featured ?? false,
                        mainImage: eq.mainImage || '',
                        images: eq.images ? JSON.parse(eq.images) : [],
                    })
                } else {
                    setError('Оборудование не найдено')
                }
            } catch (error) {
                console.error('Error loading equipment:', error)
                setError('Ошибка при загрузке данных')
            } finally {
                setLoading(false)
            }
        }

        if (equipmentId) {
            loadData()
        }
    }, [equipmentId])

    // Обработка изменений в форме
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setFormData(prev => ({ ...prev, [name]: checked }))
    }

    // Отправка формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setSaving(true)

        try {
            const formDataToSend = new FormData()

            // Добавляем все поля в FormData
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'images') {
                        formDataToSend.append(key, JSON.stringify(value))
                    } else if (typeof value === 'boolean') {
                        formDataToSend.append(key, String(value))
                    } else {
                        formDataToSend.append(key, String(value))
                    }
                }
            })

            const result = await updateEquipment(equipmentId, formDataToSend)

            if (result.success) {
                setSuccess('Оборудование успешно обновлено!')
                setTimeout(() => {
                    router.push('/admin/equipment')
                }, 2000)
            } else {
                setError(result.error || 'Ошибка при обновлении')
            }
        } catch (error) {
            console.error('Update error:', error)
            setError('Произошла ошибка при обновлении')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Загрузка оборудования...</p>
                </div>
            </div>
        )
    }

    if (error && !formData.name) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Link
                    href="/admin/equipment"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Назад к списку оборудования
                </Link>
                <div className="border border-border rounded-lg bg-background p-8 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                    <h2 className="text-xl font-semibold mb-2">Оборудование не найдено</h2>
                    <p className="text-muted-foreground mb-4">Возможно, оно было удалено или никогда не существовало</p>
                    <Link href="/admin/equipment">
                        <Button>Вернуться к списку</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Навигация */}
            <div>
                <Link
                    href="/admin/equipment"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Назад к списку оборудования
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Редактирование оборудования</h1>
                <p className="text-muted-foreground mt-1">
                    Изменение информации о &quot;{formData.name}&quot;
                </p>
            </div>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Сообщения об ошибках/успехе */}
                {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive">
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3 text-green-600">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <span className="font-medium">{success}</span>
                            <p className="text-sm mt-1">Вы будете перенаправлены к списку оборудования...</p>
                        </div>
                    </div>
                )}

                {/* Основная информация */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Название оборудования *</label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Например: Микшерный пульт Yamaha CL5"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Категория *</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                required
                            >
                                <option value="">Выберите категорию</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Артикул (SKU)</label>
                            <Input
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="EQ-AUD-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Количество *</label>
                            <Input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium">Краткое описание *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-input rounded-lg px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            placeholder="Краткое описание для карточки товара"
                            required
                        />
                    </div>

                    <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium">Полное описание</label>
                        <textarea
                            name="fullDescription"
                            value={formData.fullDescription}
                            onChange={handleChange}
                            className="w-full border border-input rounded-lg px-3 py-2 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                            placeholder="Подробное описание, характеристики, особенности..."
                        />
                    </div>
                </div>

                {/* Цены */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Цены</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Цена за день (₽) *</label>
                            <Input
                                type="number"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                                placeholder="1500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Цена за неделю (₽)</label>
                            <Input
                                type="number"
                                name="pricePerWeek"
                                value={formData.pricePerWeek}
                                onChange={handleChange}
                                placeholder="9000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Цена за месяц (₽)</label>
                            <Input
                                type="number"
                                name="pricePerMonth"
                                value={formData.pricePerMonth}
                                onChange={handleChange}
                                placeholder="30000"
                            />
                        </div>
                    </div>
                </div>

                {/* Технические характеристики */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Технические характеристики</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Бренд</label>
                            <Input
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Yamaha"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Модель</label>
                            <Input
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="CL5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Вес (кг)</label>
                            <Input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="15.5"
                                step="0.1"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Габариты</label>
                            <Input
                                name="dimensions"
                                value={formData.dimensions}
                                onChange={handleChange}
                                placeholder="1200x800x200 мм"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Требования к питанию</label>
                            <Input
                                name="powerRequirements"
                                value={formData.powerRequirements}
                                onChange={handleChange}
                                placeholder="220V, 50Hz, 1500W"
                            />
                        </div>
                    </div>
                </div>

                {/* Изображения (временно) */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Изображения</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Главное изображение (URL)</label>
                            <Input
                                name="mainImage"
                                value={formData.mainImage}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        {formData.mainImage && (
                            <div className="relative w-32 h-32 border border-border rounded-lg overflow-hidden">
                                <img
                                    src={formData.mainImage}
                                    alt="Превью"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'
                                    }}
                                />
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            * Временно поддерживаются ссылки на изображения. Загрузка файлов будет добавлена позже.
                        </p>
                    </div>
                </div>

                {/* Настройки */}
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Настройки</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Доступно для аренды</div>
                                <div className="text-sm text-muted-foreground">Оборудование можно арендовать</div>
                            </div>
                            <div className="relative inline-block w-12 h-6">
                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleCheckboxChange}
                                    className="opacity-0 w-0 h-0 peer"
                                    id="available"
                                />
                                <label
                                    htmlFor="available"
                                    className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-primary before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform peer-checked:before:translate-x-6"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Рекомендуемое</div>
                                <div className="text-sm text-muted-foreground">Показывать в рекомендациях на главной</div>
                            </div>
                            <div className="relative inline-block w-12 h-6">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleCheckboxChange}
                                    className="opacity-0 w-0 h-0 peer"
                                    id="featured"
                                />
                                <label
                                    htmlFor="featured"
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
                        <Button
                            type="submit"
                            variant="primary"
                            loading={saving}
                            disabled={saving}
                            className="gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Сохранить изменения
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}