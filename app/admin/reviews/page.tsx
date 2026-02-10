// app/admin/reviews/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
    Star, MessageSquare, User, Package, CheckCircle,
    XCircle, Filter, RefreshCw, Eye, Trash2,
    BarChart3, TrendingUp, Shield, Download
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/shared/utils'
import {
    getAllReviews,
    getReviewStats,
    toggleReviewVerification,
    adminDeleteReview
} from '@/server/actions/review.actions'

// Типы
interface Review {
    id: string
    rating: number
    comment?: string
    isVerified: boolean
    createdAt: string
    user: {
        id: string
        name?: string
        email: string
        avatar?: string
    }
    equipment: {
        id: string
        name: string
        category: {
            name: string
        }
    }
}

interface ReviewStats {
    totalReviews: number
    verifiedReviews: number
    averageRating: number
    ratingDistribution: Array<{
        rating: number
        _count: { rating: number }
    }>
    recentReviews: Review[]
}

export default function ReviewsPage() {
    const [loading, setLoading] = useState(true)
    const [reviews, setReviews] = useState<Review[]>([])
    const [stats, setStats] = useState<ReviewStats | null>(null)
    const [filters, setFilters] = useState({
        rating: '',
        verified: '',
        search: '',
    })

    const ratingOptions = [
        { value: '', label: 'Все оценки' },
        { value: '5', label: '⭐⭐⭐⭐⭐ (5)' },
        { value: '4', label: '⭐⭐⭐⭐ (4)' },
        { value: '3', label: '⭐⭐⭐ (3)' },
        { value: '2', label: '⭐⭐ (2)' },
        { value: '1', label: '⭐ (1)' },
    ]

    const verifiedOptions = [
        { value: '', label: 'Все статусы' },
        { value: 'true', label: 'Верифицированные' },
        { value: 'false', label: 'Неверифицированные' },
    ]

    useEffect(() => {
        loadData()
    }, [filters])

    const loadData = async () => {
        setLoading(true)
        try {
            const [reviewsResult, statsResult] = await Promise.all([
                getAllReviews({
                    rating: filters.rating ? parseInt(filters.rating) : undefined,
                    verified: filters.verified !== '' ? filters.verified === 'true' : undefined,
                    search: filters.search || undefined,
                }),
                getReviewStats()
            ])

            if (reviewsResult.success) {
                setReviews(reviewsResult.data as Review[])
            }

            if (statsResult.success) {
                setStats(statsResult.data as ReviewStats)
            }
        } catch (error) {
            console.error('Error loading reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleToggleVerification = async (reviewId: string) => {
        try {
            const result = await toggleReviewVerification(reviewId)
            if (result.success) {
                await loadData()
            } else {
                alert(result.error || 'Ошибка обновления')
            }
        } catch (error) {
            console.error('Error toggling verification:', error)
            alert('Ошибка обновления статуса')
        }
    }

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Удалить этот отзыв?')) return

        try {
            const result = await adminDeleteReview(reviewId)
            if (result.success) {
                await loadData()
            } else {
                alert(result.error || 'Ошибка удаления')
            }
        } catch (error) {
            console.error('Error deleting review:', error)
            alert('Ошибка удаления отзыва')
        }
    }

    const handleExport = () => {
        alert('Экспорт отзывов в разработке...')
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Отзывы</h1>
                        <div className="h-4 w-64 bg-muted rounded animate-pulse mt-1"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопки */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Управление отзывами</h1>
                    <p className="text-muted-foreground mt-1">
                        Модерация и управление отзывами пользователей
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

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Всего отзывов</div>
                            <div className="text-2xl font-bold mt-1">{stats?.totalReviews || 0}</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Верифицировано</div>
                            <div className="text-2xl font-bold mt-1">{stats?.verifiedReviews || 0}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {stats ? Math.round((stats.verifiedReviews / stats.totalReviews) * 100) : 0}%
                            </div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Средняя оценка</div>
                            <div className="text-2xl font-bold mt-1">
                                {stats?.averageRating.toFixed(1) || '0.0'}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {renderStars(Math.round(stats?.averageRating || 0))}
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Распределение</div>
                            <div className="text-2xl font-bold mt-1">
                                {stats?.ratingDistribution.find(d => d.rating === 5)?._count.rating || 0}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Отзывов с 5 звездами
                            </div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="border border-border rounded-lg bg-background p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Поиск по тексту, пользователю, оборудованию..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={filters.rating}
                            onChange={(e) => handleFilterChange('rating', e.target.value)}
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        >
                            {ratingOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={filters.verified}
                            onChange={(e) => handleFilterChange('verified', e.target.value)}
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        >
                            {verifiedOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Распределение оценок */}
            {stats && stats.ratingDistribution.length > 0 && (
                <div className="border border-border rounded-lg bg-background p-6">
                    <h2 className="text-lg font-semibold mb-4">Распределение оценок</h2>
                    <div className="space-y-3">
                        {stats.ratingDistribution.map((item) => {
                            const percentage = (item._count.rating / stats.totalReviews) * 100
                            return (
                                <div key={item.rating} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {renderStars(item.rating)}
                                            <span className="font-medium">{item.rating} звезд</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{item._count.rating}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {percentage.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Таблица отзывов */}
            <div className="border border-border rounded-lg bg-background overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-sm">Пользователь</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Оборудование</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Оценка</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Отзыв</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Статус</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Дата</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        Отзывы не найдены
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {review.user.name || 'Без имени'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {review.user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{review.equipment.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {review.equipment.category.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col items-center">
                                                {renderStars(review.rating)}
                                                <div className="text-sm font-medium mt-1">{review.rating}/5</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="max-w-xs">
                                                <div className="text-sm line-clamp-2">{review.comment || 'Без комментария'}</div>
                                                {review.comment && review.comment.length > 100 && (
                                                    <button className="text-xs text-primary hover:underline mt-1">
                                                        Показать полностью
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleToggleVerification(review.id)}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${review.isVerified
                                                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                        : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                                                    }`}
                                            >
                                                {review.isVerified ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3" />
                                                        Верифицирован
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3 h-3" />
                                                        Не верифицирован
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm">{formatDate(review.createdAt)}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/equipment/${review.equipment.id}`}
                                                    className="p-1.5 hover:bg-accent rounded transition-colors"
                                                    title="Просмотр оборудования"
                                                >
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    className="p-1.5 hover:bg-accent rounded transition-colors hover:text-red-500"
                                                    title="Удалить отзыв"
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

                {/* Пагинация */}
                <div className="border-t border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Показано {reviews.length} отзывов
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

            {/* Быстрые действия */}
            <div className="border border-border rounded-lg bg-background p-6">
                <h2 className="text-lg font-semibold mb-4">Управление отзывами</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/users"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <User className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="font-medium">Пользователи</div>
                                <div className="text-sm text-muted-foreground">Управление пользователями</div>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/admin/equipment"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Package className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <div className="font-medium">Оборудование</div>
                                <div className="text-sm text-muted-foreground">Просмотр каталога</div>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/admin/reports/reviews"
                        className="p-4 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="font-medium">Отчет по отзывам</div>
                                <div className="text-sm text-muted-foreground">Аналитика отзывов</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}