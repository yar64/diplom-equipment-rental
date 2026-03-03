// components/admin/NotificationDropdown.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Bell,
    Check,
    CheckCheck,
    X,
    Clock,
    Calendar,
    CreditCard,
    AlertCircle,
    Info,
    Megaphone,
    Wrench,
    ChevronRight
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from '@/server/actions/notification.actions'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Notification {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    link?: string
    createdAt: string
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    const { user } = useUser()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Загрузка уведомлений
    useEffect(() => {
        if (user?.id && isOpen) {
            loadNotifications()
        }
    }, [user?.id, isOpen])

    // Закрытие при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const loadNotifications = async () => {
        if (!user?.id) return

        setLoading(true)
        try {
            const result = await getUserNotifications(user.id)
            if (result.success) {
                setNotifications(result.data || [])
                setUnreadCount(result.data?.filter((n: Notification) => !n.read).length || 0)
            }
        } catch (error) {
            console.error('Error loading notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsRead = async (notificationId: string) => {
        if (!user?.id) return

        try {
            await markNotificationAsRead(notificationId, user.id)
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const handleMarkAllAsRead = async () => {
        if (!user?.id) return

        try {
            await markAllNotificationsAsRead(user.id)
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            )
            setUnreadCount(0)
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }

    // Иконка в зависимости от типа уведомления
    const getNotificationIcon = (type: string, read: boolean) => {
        const baseClass = `w-4 h-4 ${read ? 'text-muted-foreground' : ''}`

        switch (type) {
            case 'BOOKING_UPDATE':
                return <Calendar className={baseClass} />
            case 'PAYMENT':
                return <CreditCard className={baseClass} />
            case 'SYSTEM':
                return <AlertCircle className={baseClass} />
            case 'PROMOTION':
                return <Megaphone className={baseClass} />
            case 'REMINDER':
                return <Clock className={baseClass} />
            case 'MAINTENANCE':
                return <Wrench className={baseClass} />
            default:
                return <Info className={baseClass} />
        }
    }

    // Форматирование времени
    const formatTime = (date: string) => {
        try {
            return formatDistanceToNow(new Date(date), {
                addSuffix: true,
                locale: ru
            })
        } catch {
            return 'недавно'
        }
    }

    // Группировка уведомлений по дате
    const groupNotifications = () => {
        const groups: { [key: string]: Notification[] } = {
            today: [],
            yesterday: [],
            earlier: []
        }

        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        notifications.forEach(notification => {
            const date = new Date(notification.createdAt)

            if (date.toDateString() === today.toDateString()) {
                groups.today.push(notification)
            } else if (date.toDateString() === yesterday.toDateString()) {
                groups.yesterday.push(notification)
            } else {
                groups.earlier.push(notification)
            }
        })

        return groups
    }

    const groups = groupNotifications()
    const hasNotifications = notifications.length > 0

    return (
        <div className="relative">
            {/* Кнопка уведомлений */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 border border-input rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth relative"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></span>
                    </>
                )}
            </button>

            {/* Выпадающий список */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-96 bg-background border border-input rounded-lg shadow-lg overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in"
                >
                    {/* Заголовок */}
                    <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            <h3 className="font-semibold">Уведомления</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {unreadCount} новых
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                            >
                                <CheckCheck className="w-3 h-3" />
                                <span>Все прочитано</span>
                            </button>
                        )}
                    </div>

                    {/* Список уведомлений */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-pulse space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                                </div>
                            </div>
                        ) : hasNotifications ? (
                            <>
                                {/* Сегодня */}
                                {groups.today.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/20">
                                            Сегодня
                                        </div>
                                        {groups.today.map(notification => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                                onMarkAsRead={handleMarkAsRead}
                                                getIcon={getNotificationIcon}
                                                formatTime={formatTime}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Вчера */}
                                {groups.yesterday.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/20">
                                            Вчера
                                        </div>
                                        {groups.yesterday.map(notification => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                                onMarkAsRead={handleMarkAsRead}
                                                getIcon={getNotificationIcon}
                                                formatTime={formatTime}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Ранее */}
                                {groups.earlier.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/20">
                                            Ранее
                                        </div>
                                        {groups.earlier.map(notification => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                                onMarkAsRead={handleMarkAsRead}
                                                getIcon={getNotificationIcon}
                                                formatTime={formatTime}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                                <p className="text-sm text-muted-foreground">Нет уведомлений</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Здесь будут появляться уведомления о заказах и событиях
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {hasNotifications && (
                        <div className="p-2 border-t border-border bg-muted/30 text-center">
                            <Link
                                href="/admin/notifications"
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                                onClick={() => setIsOpen(false)}
                            >
                                <span>Все уведомления</span>
                                <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// Компонент одного уведомления
function NotificationItem({
    notification,
    onMarkAsRead,
    getIcon,
    formatTime
}: {
    notification: Notification
    onMarkAsRead: (id: string) => void
    getIcon: (type: string, read: boolean) => JSX.Element
    formatTime: (date: string) => string
}) {
    const [isHovered, setIsHovered] = useState(false)

    const handleClick = () => {
        if (!notification.read) {
            onMarkAsRead(notification.id)
        }
        // Здесь можно добавить переход по ссылке
        if (notification.link) {
            window.location.href = notification.link
        }
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
        p-4 border-b border-border last:border-0 hover:bg-accent/50 cursor-pointer
        transition-colors relative group
        ${!notification.read ? 'bg-primary/5' : ''}
      `}
            onClick={handleClick}
        >
            <div className="flex items-start gap-3">
                {/* Иконка */}
                <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
          ${!notification.read ? 'bg-primary/10' : 'bg-muted'}
        `}>
                    {getIcon(notification.type, notification.read)}
                </div>

                {/* Контент */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className={`
              text-sm font-medium truncate
              ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}
            `}>
                            {notification.title}
                        </h4>
                        {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground/70">
                            {formatTime(notification.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Кнопка "Отметить как прочитанное" при наведении */}
                {!notification.read && isHovered && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onMarkAsRead(notification.id)
                        }}
                        className="absolute right-2 top-2 p-1 bg-background border border-input rounded-md hover:bg-accent transition-colors"
                        title="Отметить как прочитанное"
                    >
                        <Check className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    )
}