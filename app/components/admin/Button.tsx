// components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost'
    children: ReactNode
}

export function Button({
    className,
    variant = 'default',
    children,
    ...props
}: ButtonProps) {
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
    }

    return (
        <button
            className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}