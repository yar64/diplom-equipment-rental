'use client'

import { Edit, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { deleteCategory } from '@/server/actions/category.actions'
import Button from '../ui/Button'

interface CategoryActionsProps {
    category: {
        id: string
        name: string
        _count?: {
            equipment: number
            children: number
        }
    }
    onDelete?: () => void
}

export default function CategoryActions({ category, onDelete }: CategoryActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        console.log('🗑️ Удаляем категорию:', category.id)

        const result = await deleteCategory(category.id)
        console.log('📦 Результат удаления:', result)

        if (result.success) {
            setShowDeleteDialog(false)
            if (onDelete) {
                onDelete()
            } else {
                window.location.reload()
            }
        } else {
            alert(`Ошибка: ${result.error || 'Неизвестная ошибка'}`)
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    // Проверяем, можно ли удалить категорию
    const hasChildren = category._count?.children && category._count.children > 0
    const hasEquipment = category._count?.equipment && category._count.equipment > 0
    const canDelete = !hasChildren && !hasEquipment

    return (
        <>
            <div className="flex items-center gap-1">
                <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="p-1.5 hover:bg-accent rounded-md transition-colors"
                    title="Редактировать"
                >
                    <Edit className="w-4 h-4" />
                </Link>

                <button
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isDeleting}
                    className="p-1.5 hover:bg-accent rounded-md transition-colors hover:text-red-500 disabled:opacity-50"
                    title="Удалить"
                >
                    {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Диалог подтверждения удаления */}
            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-2">Подтверждение удаления</h3>

                        {!canDelete ? (
                            // Если нельзя удалить - показываем причину
                            <div className="mb-6">
                                <p className="text-muted-foreground mb-3">
                                    Нельзя удалить категорию "{category.name}", так как:
                                </p>
                                <ul className="space-y-2 text-sm">
                                    {hasChildren && (
                                        <li className="flex items-center gap-2 text-orange-600">
                                            <span>•</span>
                                            <span>У неё есть дочерние категории ({category._count?.children} шт.)</span>
                                        </li>
                                    )}
                                    {hasEquipment && (
                                        <li className="flex items-center gap-2 text-orange-600">
                                            <span>•</span>
                                            <span>В ней есть оборудование ({category._count?.equipment} шт.)</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ) : (
                            // Если можно удалить - стандартное подтверждение
                            <p className="text-muted-foreground mb-6">
                                Вы уверены, что хотите удалить категорию "{category.name}"?
                                Это действие нельзя отменить.
                            </p>
                        )}

                        <div className="flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                                disabled={isDeleting}
                            >
                                Отмена
                            </Button>

                            {canDelete && (
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Удаление...' : 'Удалить'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}