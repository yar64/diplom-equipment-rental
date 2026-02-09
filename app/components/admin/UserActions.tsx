// components/admin/UserActions.tsx
'use client'

import { Edit, Trash2, MoreVertical, UserCog } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface UserActionsProps {
    user: {
        id: string
        email: string
        name?: string
        role: string
    }
    onRoleChange: (userId: string, newRole: string) => Promise<void>
    onDelete: (userId: string) => Promise<void>
}

const roleOptions = [
    { value: 'CUSTOMER', label: 'Клиент' },
    { value: 'STAFF', label: 'Сотрудник' },
    { value: 'MANAGER', label: 'Менеджер' },
    { value: 'ADMIN', label: 'Администратор' },
]

export default function UserActions({ user, onRoleChange, onDelete }: UserActionsProps) {
    const [isChangingRole, setIsChangingRole] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const handleRoleChange = async (newRole: string) => {
        setIsChangingRole(true)
        await onRoleChange(user.id, newRole)
        setIsChangingRole(false)
        setShowMenu(false)
    }

    const handleDelete = async () => {
        if (!confirm(`Удалить пользователя ${user.email}?`)) return
        await onDelete(user.id)
        setShowMenu(false)
    }

    const getRoleLabel = (role: string) => {
        return roleOptions.find(opt => opt.value === role)?.label || role
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-accent rounded transition-colors"
                disabled={isChangingRole}
            >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-lg z-20">
                        {/* Изменение роли */}
                        <div className="px-4 py-3 border-b border-border">
                            <div className="text-sm font-medium mb-2">Роль пользователя</div>
                            <div className="flex items-center gap-2 mb-1">
                                <UserCog className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                    Текущая: <span className="font-medium">{getRoleLabel(user.role)}</span>
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {roleOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleRoleChange(option.value)}
                                        disabled={isChangingRole || user.role === option.value}
                                        className={`px-2 py-1 text-xs rounded transition-colors ${user.role === option.value
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                                            } ${isChangingRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Редактирование */}
                        <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors border-b border-border"
                            onClick={() => setShowMenu(false)}
                        >
                            <Edit className="w-4 h-4" />
                            <span>Редактировать профиль</span>
                        </Link>

                        {/* Удаление */}
                        <button
                            onClick={handleDelete}
                            disabled={isChangingRole}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-accent transition-colors text-red-500 hover:text-red-600 disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>{isChangingRole ? 'Обработка...' : 'Удалить пользователя'}</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}