// app/admin/categories/page.tsx
import { getCategories } from '@/server/actions/category.actions'
import { Folder, Plus, Edit, Trash2, ChevronRight, Package, FolderTree } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../components/admin/Button'
import { Input } from '../../components/admin/Input'
import CategoryActions from '../../components/admin/CategoryActions'

export default async function CategoriesPage() {
    const categoriesResult = await getCategories()
    const categories = categoriesResult.success ? categoriesResult.data || [] : []

    // Группируем категории по родительским
    const rootCategories = categories.filter(c => !c.parentId)
    const childCategories = categories.filter(c => c.parentId)

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопка добавления */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Категории оборудования</h1>
                    <p className="text-muted-foreground mt-1">
                        Управление категориями для организации оборудования
                    </p>
                </div>
                <Link href="/admin/categories/create">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Добавить категорию
                    </Button>
                </Link>
            </div>

            {/* Панель поиска */}
            <div className="border border-border rounded-lg bg-background p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Поиск по названию категории..."
                            className="max-w-md"
                        />
                    </div>
                    <div>
                        <select className="border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                            <option value="">Все категории</option>
                            <option value="root">Только основные</option>
                            <option value="with-children">С дочерними</option>
                            <option value="empty">Без оборудования</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Список категорий */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Основные категории */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="border border-border rounded-lg bg-background overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Категории оборудования</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Всего категорий: {categories.length}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FolderTree className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm">
                                        {rootCategories.length} основных
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-border">
                            {rootCategories.map((category) => {
                                const children = childCategories.filter(c => c.parentId === category.id)

                                return (
                                    <div key={category.id}>
                                        {/* Основная категория */}
                                        <div className="px-6 py-4 hover:bg-accent/50 transition-colors group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <Folder className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{category.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {category.description || 'Нет описания'}
                                                        </div>
                                                        {children.length > 0 && (
                                                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                                <ChevronRight className="w-3 h-3" />
                                                                <span>{children.length} подкатегорий</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Package className="w-4 h-4 text-muted-foreground" />
                                                            <span>{/* Здесь нужно количество оборудования */}0</span>
                                                        </div>
                                                    </div>
                                                    <CategoryActions category={category} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Дочерние категории */}
                                        {children.length > 0 && (
                                            <div className="pl-16 bg-muted/30">
                                                {children.map((child) => (
                                                    <div
                                                        key={child.id}
                                                        className="px-6 py-3 hover:bg-accent/30 transition-colors border-t border-border/50"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                                                                    <Folder className="w-4 h-4 text-muted-foreground" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-sm">{child.name}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {child.description || 'Нет описания'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <CategoryActions category={child} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Статистика */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">Всего категорий</div>
                                    <div className="text-2xl font-bold mt-1">{categories.length}</div>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <Folder className="w-5 h-5 text-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">Основные категории</div>
                                    <div className="text-2xl font-bold mt-1">{rootCategories.length}</div>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <FolderTree className="w-5 h-5 text-green-500" />
                                </div>
                            </div>
                        </div>
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">Дочерние категории</div>
                                    <div className="text-2xl font-bold mt-1">{childCategories.length}</div>
                                </div>
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <div className="w-5 h-5 text-purple-500">
                                        <Folder className="w-4 h-4" />
                                        <ChevronRight className="w-3 h-3 -ml-1 -mt-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Боковая панель */}
                <div className="space-y-6">
                    {/* Иерархия */}
                    <div className="border border-border rounded-lg bg-background p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <FolderTree className="w-5 h-5 text-primary" />
                            <div>
                                <h2 className="text-lg font-semibold">Иерархия категорий</h2>
                                <p className="text-sm text-muted-foreground">Древовидная структура</p>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {rootCategories.map((category) => {
                                const children = childCategories.filter(c => c.parentId === category.id)

                                return (
                                    <div key={category.id} className="text-sm">
                                        <div className="font-medium py-1">{category.name}</div>
                                        {children.length > 0 && (
                                            <div className="pl-4 space-y-1">
                                                {children.map((child) => (
                                                    <div
                                                        key={child.id}
                                                        className="text-muted-foreground py-0.5"
                                                    >
                                                        └─ {child.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Быстрые действия */}
                    <div className="border border-border rounded-lg bg-background">
                        <div className="px-6 py-4 border-b border-border">
                            <h2 className="text-lg font-semibold">Быстрые действия</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            <Link
                                href="/admin/categories/create"
                                className="flex items-center gap-3 p-3 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors-smooth"
                            >
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Plus className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">Новая категория</div>
                                    <div className="text-xs text-muted-foreground">Создать основную категорию</div>
                                </div>
                            </Link>

                            <Link
                                href="/admin/categories/create?type=child"
                                className="flex items-center gap-3 p-3 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors-smooth"
                            >
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Folder className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">Подкатегория</div>
                                    <div className="text-xs text-muted-foreground">Добавить дочернюю</div>
                                </div>
                            </Link>

                            <Link
                                href="/admin/equipment"
                                className="flex items-center gap-3 p-3 border border-input rounded-lg hover:border-primary hover:bg-accent transition-colors-smooth"
                            >
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Package className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">Оборудование</div>
                                    <div className="text-xs text-muted-foreground">Управление оборудованием</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Подсказки */}
                    <div className="border border-border rounded-lg bg-background p-6">
                        <h3 className="font-semibold mb-3">Подсказки</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                                <span>Категории с оборудованием нельзя удалить</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                                <span>Для удаления категории сначала удалите все дочерние</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                                <span>Категории без оборудования отображаются серым</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}