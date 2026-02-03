// components/ui/Input.tsx
import { InputHTMLAttributes } from 'react'
import { cn } from './utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    // Можно добавить дополнительные пропсы если нужно
}

export function Input({ className, ...props }: InputProps) {
    return (
        <input
            className={cn(
                'border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background',
                className
            )}
            {...props}
        />
    )
}