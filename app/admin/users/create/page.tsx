// app/admin/users/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, User, Mail, Phone, Lock, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { createUser } from '@/server/actions/user.actions'

export default function CreateUserPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER' as 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Валидация
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают')
            return
        }

        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов')
            return
        }

        setLoading(true)

        try {
            // Создаем FormData для передачи в серверный экшен
            const data = new FormData()
            data.append('name', formData.name)
            data.append('email', formData.email)
            data.append('phone', formData.phone)
            data.append('password', formData.password)
            data.append('role', formData.role)

            const result = await createUser(data)

            if (result.success) {
                setSuccess(result.message || 'Пользователь успешно создан!')

                // Очищаем форму
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    role: 'CUSTOMER'
                })

                // Через 2 секунды редиректим обратно к списку
                setTimeout(() => {
                    router.push('/admin/users')
                }, 2000)
            } else {
                setError(result.error || 'Ошибка при создании пользователя')
            }
        } catch (err: any) {
            console.error('Create user error:', err)
            setError(err.message || 'Произошла ошибка при создании пользователя')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопка назад */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Назад к пользователям
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Создание пользователя</h1>
                        <p className="text-muted-foreground mt-1">
                            Добавьте нового пользователя в систему
                        </p>
                    </div>
                </div>
            </div>

            {/* Форма */}
            <div className="max-w-2xl">
                <div className="border border-border rounded-lg bg-background p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2 text-destructive">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2 text-green-600">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="font-medium">{success}</span>
                                <p className="text-sm mt-1 text-green-500">
                                    Вы будете перенаправлены к списку пользователей через 2 секунды...
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Основная информация */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Основная информация
                                </h3>

                                <Input
                                    label="ФИО *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Иван Иванов"
                                    icon={<User className="w-4 h-4" />}
                                    required
                                />

                                <Input
                                    label="Email *"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="user@example.com"
                                    icon={<Mail className="w-4 h-4" />}
                                    required
                                />

                                <Input
                                    label="Телефон"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+7 (999) 123-45-67"
                                    icon={<Phone className="w-4 h-4" />}
                                />
                            </div>

                            {/* Безопасность */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    Безопасность
                                </h3>

                                <Input
                                    label="Пароль *"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Минимум 6 символов"
                                    icon={<Lock className="w-4 h-4" />}
                                    required
                                    minLength={6}
                                />

                                <Input
                                    label="Подтверждение пароля *"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Повторите пароль"
                                    icon={<Lock className="w-4 h-4" />}
                                    required
                                />
                            </div>

                            {/* Права доступа */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Права доступа
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Роль пользователя *
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                    >
                                        <option value="CUSTOMER">Клиент</option>
                                        <option value="STAFF">Сотрудник</option>
                                        <option value="MANAGER">Менеджер</option>
                                        <option value="ADMIN">Администратор</option>
                                    </select>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Определяет уровень доступа пользователя в системе
                                    </p>
                                </div>

                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-medium text-sm mb-2">Описание ролей:</h4>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                        <li>• <span className="font-medium">Клиент</span> — только бронирование и просмотр каталога</li>
                                        <li>• <span className="font-medium">Сотрудник</span> — просмотр заказов и инвентаря</li>
                                        <li>• <span className="font-medium">Менеджер</span> — управление заказами и оборудованием</li>
                                        <li>• <span className="font-medium">Администратор</span> — полный доступ ко всем функциям</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Кнопки */}
                        <div className="flex items-center justify-between pt-6 border-t border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/admin/users')}
                                disabled={loading}
                            >
                                Отмена
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                icon={<Save className="w-4 h-4" />}
                            >
                                Создать пользователя
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Подсказки */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-1">💡 Советы по созданию пользователя:</p>
                    <ul className="space-y-1">
                        <li>• Обязательно сохраните пароль в безопасном месте</li>
                        <li>• Для сотрудников выберите соответствующую роль</li>
                        <li>• После создания пользователь сможет войти с указанными email и паролем</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}