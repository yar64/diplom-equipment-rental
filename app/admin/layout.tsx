// app/admin/layout.tsx
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Анимированный фон как в глобальных стилях */}
            <div className="grid-background">
                <div className="grid-pattern"></div>
                <div className="floating-dots">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="dot"></div>
                    ))}
                </div>
            </div>

            <AdminSidebar />
            <div className="pl-64">
                <AdminHeader />
                <main className="p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}