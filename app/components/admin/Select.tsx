// components/ui/Select.tsx
'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from './utils'

interface SelectProps {
    value: string
    onValueChange: (value: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
    className?: string
    required?: boolean
}

export function Select({
    value,
    onValueChange,
    options,
    placeholder = 'Выберите...',
    className,
    required
}: SelectProps) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className={cn(
                    'w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background appearance-none',
                    className
                )}
                required={required}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
    )
}