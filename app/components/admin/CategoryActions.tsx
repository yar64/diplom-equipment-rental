// app/admin/categories/components/CategoryActions.tsx
'use client'

import { Edit, Trash2, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { deleteCategory } from '@/server/actions/category.actions'

interface CategoryActionsProps {
    category: {
        id: string
        name: string
    }
}

export default function CategoryActions({ category }: CategoryActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Удалить категорию "${category.name}"?`)) return

        setIsDeleting(true)
        const result = await deleteCategory(category.id)

        if (result.success) {
            window.location.reload()
        } else {
            alert(result.error || 'Ошибка при удалении')
            setIsDeleting(false)
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-accent rounded transition-colors"
                disabled={isDeleting}
            >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-20">
                        <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                            onClick={() => setShowMenu(false)}
                        >
                            <Edit className="w-4 h-4" />
                            <span>Редактировать</span>
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-accent transition-colors text-red-500 hover:text-red-600 disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>
                                {isDeleting ? 'Удаление...' : 'Удалить'}
                            </span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}