// components/admin/StatCard.tsx
import { TrendingUp } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    description?: string
    trend?: string
    delay?: string
}

export default function StatCard({
    title,
    value,
    icon,
    description,
    trend,
    delay = '0ms'
}: StatCardProps) {
    return (
        <div
            className="border border-border rounded-lg p-6 bg-background hover:border-primary/50 hover-lift transition-smooth card-hover"
            style={{ animationDelay: delay }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-accent rounded-lg border border-border">
                    <div className="text-primary">
                        {icon}
                    </div>
                </div>

                {trend && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        {trend}
                    </div>
                )}
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
            <p className="text-foreground font-medium">{title}</p>

            {description && (
                <p className="text-sm text-muted-foreground mt-2">{description}</p>
            )}
        </div>
    )
}