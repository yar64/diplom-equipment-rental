// app/admin/equipment/page.tsx
import { getEquipment } from '@/server/actions/equipment.actions'
import { Package, Plus, Edit, Trash2, Eye, Filter, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../components/admin/Button'
import { Input } from '../../components/admin/Input'

// Временный интерфейс, пока не настроены пути
interface EquipmentItem {
    id: string
    name: string
    pricePerDay: number
    available: boolean  // Исправлено с isAvailable на available
    quantity: number
    // Другие поля которые используешь
}

export default async function EquipmentPage() {
    const equipmentResult = await getEquipment()

    // Явно указываем тип
    const equipment = equipmentResult.success
        ? (equipmentResult.data as EquipmentItem[]) || []
        : []

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопка добавления */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Оборудование</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление всем оборудованием для аренды
                    </p>
                </div>
                <Link href="/admin/equipment/create">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Добавить оборудование
                    </Button>
                </Link>
            </div>

            {/* Панель поиска и фильтров */}
            <div className="border border-border rounded-lg bg-background p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск по названию, описанию..."
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <select className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                            <option value="">Все категории</option>
                            <option value="audio">Аудио оборудование</option>
                            <option value="video">Видео оборудование</option>
                            <option value="lighting">Световое оборудование</option>
                        </select>
                    </div>
                    <div>
                        <select className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                            <option value="">Все статусы</option>
                            <option value="available">Доступно</option>
                            <option value="rented">В аренде</option>
                            <option value="maintenance">На обслуживании</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Таблица оборудования */}
            <div className="border border-border rounded-lg bg-background overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-sm">Название</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Категория</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Цена/день</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Статус</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Количество</th>
                                <th className="text-left py-3 px-4 font-medium text-sm">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {/* Теперь TypeScript знает тип item */}
                            {equipment.map((item: EquipmentItem) => (
                                <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                                                <Package className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">ID: {item.id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                            Аудио
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{item.pricePerDay?.toLocaleString('ru-RU')} ₽</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {/* Исправлено: item.available вместо item.isAvailable */}
                                            <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span className="text-sm">{item.available ? 'Доступно' : 'Недоступно'}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="text-sm">{item.quantity || 1}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/equipment/${item.id}`}
                                                className="p-1.5 hover:bg-accent rounded transition-colors"
                                                title="Просмотр"
                                            >
                                                <Eye className="w-4 h-4 text-muted-foreground" />
                                            </Link>
                                            <Link
                                                href={`/admin/equipment/${item.id}/edit`}
                                                className="p-1.5 hover:bg-accent rounded transition-colors"
                                                title="Редактировать"
                                            >
                                                <Edit className="w-4 h-4 text-muted-foreground" />
                                            </Link>
                                            <button
                                                className="p-1.5 hover:bg-accent rounded transition-colors hover:text-red-500"
                                                title="Удалить"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Пагинация */}
                <div className="border-t border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Показано {equipment.length} из 28 записей
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 border border-input rounded text-sm hover:bg-accent transition-colors">
                                Назад
                            </button>
                            <button className="px-3 py-1 border border-input rounded text-sm bg-accent font-medium">
                                1
                            </button>
                            <button className="px-3 py-1 border border-input rounded text-sm hover:bg-accent transition-colors">
                                2
                            </button>
                            <button className="px-3 py-1 border border-input rounded text-sm hover:bg-accent transition-colors">
                                Далее
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Всего единиц</div>
                            <div className="text-2xl font-bold mt-1">{equipment.length}</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Package className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Доступно сейчас</div>
                            <div className="text-2xl font-bold mt-1">
                                {/* Исправлено: item.available вместо item.isAvailable */}
                                {equipment.filter(e => e.available).length}
                            </div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <div className="w-5 h-5 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Средняя цена</div>
                            <div className="text-2xl font-bold mt-1">
                                {equipment.length > 0
                                    ? Math.round(equipment.reduce((acc, e) => acc + (e.pricePerDay || 0), 0) / equipment.length).toLocaleString('ru-RU')
                                    : '0'} ₽
                            </div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <div className="w-5 h-5 text-purple-500 font-bold">₽</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}