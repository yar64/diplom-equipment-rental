'use client'

import { useEffect, useState } from 'react'
import {
    X, Package, Calendar, Star, CheckCircle, XCircle,
    Image as ImageIcon, Weight, Ruler, Zap, Building2,
    Hash, Tag, FileText, Box, CalendarDays
} from 'lucide-react'
import { getEquipmentById } from '@/server/actions/equipment.actions'
import { Equipment } from '@/shared/types'
import { formatDate } from '@/shared/utils'
import Button from '../ui/Button'

interface EquipmentPreviewModalProps {
    equipmentId: string | null
    isOpen: boolean
    onClose: () => void
}

export default function EquipmentPreviewModal({ equipmentId, isOpen, onClose }: EquipmentPreviewModalProps) {
    const [equipment, setEquipment] = useState<Equipment | null>(null)
    const [loading, setLoading] = useState(false)
    const [activeImage, setActiveImage] = useState<string | null>(null)

    // Загружаем данные при открытии
    useEffect(() => {
        if (equipmentId && isOpen) {
            loadEquipment(equipmentId)
        }
    }, [equipmentId, isOpen])

    const loadEquipment = async (id: string) => {
        setLoading(true)
        try {
            const result = await getEquipmentById(id)
            if (result.success && result.data) {
                setEquipment(result.data)
                // Парсим изображения если нужно (у тебя images как строка JSON)
                let images: string[] = []
                try {
                    const parsed = JSON.parse(result.data.images || '[]')
                    images = Array.isArray(parsed) ? parsed : []
                } catch {
                    images = []
                }
                setActiveImage(images[0] || result.data.mainImage || null)
            }
        } catch (error) {
            console.error('Error loading equipment:', error)
        } finally {
            setLoading(false)
        }
    }

    // Закрытие по ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
        }
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    if (!isOpen) return null

    // Парсим изображения
    let images: string[] = []
    if (equipment?.images) {
        try {
            const parsed = JSON.parse(equipment.images)
            images = Array.isArray(parsed) ? parsed : []
        } catch {
            images = []
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Затемнение фона */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Модальное окно */}
            <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Просмотр оборудования
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Контент */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-pulse text-center">
                                <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                                <p className="text-muted-foreground">Загрузка данных...</p>
                            </div>
                        </div>
                    ) : !equipment ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Оборудование не найдено
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Основная информация */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Изображения */}
                                <div className="md:col-span-1 space-y-3">
                                    <div className="aspect-square bg-accent/30 rounded-lg overflow-hidden border border-border">
                                        {activeImage ? (
                                            <img
                                                src={activeImage}
                                                alt={equipment.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Миниатюры */}
                                    {images.length > 0 && (
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImage(img)}
                                                    className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`${equipment.name} - ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Характеристики */}
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">{equipment.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-muted-foreground">
                                                ID: {equipment.id}
                                            </span>
                                            {equipment.slug && (
                                                <>
                                                    <span className="text-muted-foreground">•</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        slug: {equipment.slug}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Цены */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-primary/5 p-3 rounded-lg">
                                            <div className="text-sm text-muted-foreground">За день</div>
                                            <div className="text-xl font-bold text-primary">
                                                {equipment.pricePerDay.toLocaleString()} ₽
                                            </div>
                                        </div>
                                        {equipment.pricePerWeek && (
                                            <div className="bg-accent/50 p-3 rounded-lg">
                                                <div className="text-sm text-muted-foreground">За неделю</div>
                                                <div className="text-xl font-bold">
                                                    {equipment.pricePerWeek.toLocaleString()} ₽
                                                </div>
                                            </div>
                                        )}
                                        {equipment.pricePerMonth && (
                                            <div className="bg-accent/50 p-3 rounded-lg">
                                                <div className="text-sm text-muted-foreground">За месяц</div>
                                                <div className="text-xl font-bold">
                                                    {equipment.pricePerMonth.toLocaleString()} ₽
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Статусы */}
                                    <div className="flex flex-wrap gap-3">
                                        <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${equipment.available
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {equipment.available ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            {equipment.available ? 'Доступно' : 'Недоступно'}
                                        </div>

                                        {equipment.featured && (
                                            <div className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                                                <Star className="w-4 h-4 fill-current" />
                                                Рекомендуемое
                                            </div>
                                        )}

                                        <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                                            <Box className="w-4 h-4" />
                                            В наличии: {equipment.quantity} шт.
                                        </div>
                                    </div>

                                    {/* Технические характеристики */}
                                    {(equipment.brand || equipment.model || equipment.serialNumber ||
                                        equipment.weight || equipment.dimensions || equipment.powerRequirements) && (
                                            <div className="border border-border rounded-lg p-4">
                                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                                    <Tag className="w-4 h-4" />
                                                    Технические характеристики
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    {equipment.brand && (
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">Бренд:</span>
                                                            <span className="font-medium">{equipment.brand}</span>
                                                        </div>
                                                    )}
                                                    {equipment.model && (
                                                        <div className="flex items-center gap-2">
                                                            <Hash className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">Модель:</span>
                                                            <span className="font-medium">{equipment.model}</span>
                                                        </div>
                                                    )}
                                                    {equipment.serialNumber && (
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">Серийный номер:</span>
                                                            <span className="font-medium">{equipment.serialNumber}</span>
                                                        </div>
                                                    )}
                                                    {equipment.weight && (
                                                        <div className="flex items-center gap-2">
                                                            <Weight className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">Вес:</span>
                                                            <span className="font-medium">{equipment.weight} кг</span>
                                                        </div>
                                                    )}
                                                    {equipment.dimensions && (
                                                        <div className="flex items-center gap-2">
                                                            <Ruler className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">Размеры:</span>
                                                            <span className="font-medium">{equipment.dimensions}</span>
                                                        </div>
                                                    )}
                                                    {equipment.powerRequirements && (
                                                        <div className="flex items-center gap-2">
                                                            <Zap className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">Питание:</span>
                                                            <span className="font-medium">{equipment.powerRequirements}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Описание */}
                                    {equipment.description && (
                                        <div className="border border-border rounded-lg p-4">
                                            <h4 className="font-medium mb-2">Описание</h4>
                                            <p className="text-muted-foreground text-sm">
                                                {equipment.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Полное описание */}
                                    {equipment.fullDescription && (
                                        <div className="border border-border rounded-lg p-4">
                                            <h4 className="font-medium mb-2">Подробное описание</h4>
                                            <p className="text-muted-foreground text-sm whitespace-pre-line">
                                                {equipment.fullDescription}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Дополнительная информация */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border pt-4">
                                <div>
                                    <div className="text-xs text-muted-foreground">Категория</div>
                                    <div className="font-medium text-sm mt-1">
                                        {equipment.category?.name || '—'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Рейтинг</div>
                                    <div className="font-medium text-sm mt-1 flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        {equipment.rating || 0}
                                        <span className="text-muted-foreground text-xs">
                                            ({equipment.reviewCount || 0} отзывов)
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Создано</div>
                                    <div className="font-medium text-sm mt-1 flex items-center gap-1">
                                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                        {formatDate(equipment.createdAt)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Обновлено</div>
                                    <div className="font-medium text-sm mt-1 flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        {formatDate(equipment.updatedAt)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Подвал */}
                <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Закрыть
                    </Button>
                </div>
            </div>
        </div>
    )
}