// app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
    Search, Filter, User, Mail, Phone, Calendar,
    ChevronDown, Download, Plus, Users, Shield,
    CheckCircle, XCircle
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/shared/utils'
import { getUsers } from '@/server/actions/user.actions'
import UserActions from '../../components/admin/UserActions'

// Типы
interface UserItem {
    id: string
    email: string
    name?: string
    phone?: string
    role: string
    createdAt: string
    _count: {
        bookings: number
        favorites: number
        reviews: number
    }
}

const roleConfig = {
    ADMIN: { color: 'bg-red-500', text: 'Админ', icon: Shield },
    MANAGER: { color: 'bg-blue-500', text: 'Менеджер', icon: Shield },
    STAFF: { color: 'bg-green-500', text: 'Сотрудник', icon: User },
    CUSTOMER: { color: 'bg-gray-500', text: 'Клиент', icon: User },
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        role: '',
        search: '',
    })

    const roleOptions = [
        { value: '', label: 'Все роли' },
        { value: 'CUSTOMER', label: 'Клиенты' },
        { value: 'STAFF', label: 'Сотрудники' },
        { value: 'MANAGER', label: 'Менеджеры' },
        { value: 'ADMIN', label: 'Администраторы' },
    ]

    useEffect(() => {
        loadUsers()
    }, [filters])

    const loadUsers = async () => {
        setLoading(true)
        try {
            const result = await getUsers({
                role: filters.role || undefined,
                search: filters.search || undefined,
            })

            if (result.success) {
                setUsers(result.data as UserItem[])
            }
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            // Здесь будет вызов API для изменения роли
            alert(`Изменение роли пользователя ${userId} на ${newRole}`)
            // После успешного изменения перезагружаем пользователей
            await loadUsers()
        } catch (error) {
            console.error('Error changing role:', error)
            alert('Ошибка при изменении роли')
        }
    }

    const handleDeleteUser = async (userId: string) => {
        try {
            // Здесь будет вызов API для удаления пользователя
            alert(`Удаление пользователя ${userId}`)
            // После успешного удаления перезагружаем пользователей
            await loadUsers()
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Ошибка при удалении пользователя')
        }
    }

    const handleExport = () => {
        // Логика экспорта данных
        alert('Экспорт пользователей в разработке...')
    }

    const stats = {
        total: users.length,
        customers: users.filter(u => u.role === 'CUSTOMER').length,
        staff: users.filter(u => ['STAFF', 'MANAGER', 'ADMIN'].includes(u.role)).length,
        active: users.filter(u => u._count.bookings > 0).length,
    }

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопки */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Пользователи</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление всеми пользователями системы
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Экспорт
                    </button>
                    <Link
                        href="/admin/users/create"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Добавить пользователя
                    </Link>
                </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Всего пользователей</div>
                            <div className="text-2xl font-bold mt-1">{stats.total}</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Клиентов</div>
                            <div className="text-2xl font-bold mt-1">{stats.customers}</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <User className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Сотрудников</div>
                            <div className="text-2xl font-bold mt-1">{stats.staff}</div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Активных</div>
                            <div className="text-2xl font-bold mt-1">{stats.active}</div>
                        </div>
                        <div className="p-3 bg-orange-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-orange-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="border border-border rounded-lg bg-background p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Поиск по имени, email, телефону..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        >
                            {roleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Таблица пользователей */}
            <div className="border border-border rounded-lg bg-background overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-sm">Пользователь</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Контакт</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Роль</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Статистика</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Дата регистрации</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center">
                                        <div className="animate-pulse text-muted-foreground">
                                            Загрузка пользователей...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                        Пользователи не найдены
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const RoleIcon = roleConfig[user.role as keyof typeof roleConfig]?.icon || User

                                    return (
                                        <tr key={user.id} className="hover:bg-accent/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {user.name || 'Без имени'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            ID: {user.id.slice(0, 8)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                                            <span>{user.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${roleConfig[user.role as keyof typeof roleConfig]?.color || 'bg-gray-500'}`}>
                                                        <RoleIcon className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">
                                                            {roleConfig[user.role as keyof typeof roleConfig]?.text || user.role}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {user._count.bookings > 0 ? `${user._count.bookings} бронирований` : 'Нет бронирований'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="text-center">
                                                        <div className="font-semibold">{user._count.bookings}</div>
                                                        <div className="text-xs text-muted-foreground">Заказы</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-semibold">{user._count.favorites}</div>
                                                        <div className="text-xs text-muted-foreground">Избранное</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-semibold">{user._count.reviews}</div>
                                                        <div className="text-xs text-muted-foreground">Отзывы</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {formatDate(user.createdAt)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <UserActions
                                                    user={user}
                                                    onRoleChange={handleRoleChange}
                                                    onDelete={handleDeleteUser}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Пагинация */}
                <div className="border-t border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Показано {users.length} пользователей
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
        </div>
    )
}