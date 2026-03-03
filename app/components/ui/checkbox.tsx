// components/ui/checkbox.tsx
'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

const Checkbox = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  className = ''
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked)
  
  const handleChange = () => {
    if (disabled) return
    const newValue = !isChecked
    setIsChecked(newValue)
    onChange?.(newValue)
  }
  
  return (
    <div className={`flex items-start ${className}`}>
      <button
        type="button"
        onClick={handleChange}
        disabled={disabled}
        className={`
          mt-0.5 flex h-5 w-5 items-center justify-center rounded border
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${isChecked ? 'border-black bg-black' : 'border-gray-300 bg-white'}
          focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0
        `}
      >
        {isChecked && (
          <Check className="h-3.5 w-3.5 text-white" />
        )}
      </button>
      
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={`mt-1 text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Группа чекбоксов для выбора дополнительных услуг
interface AdditionalService {
  id: string
  name: string
  description: string
  price: number
}

const AdditionalServicesCheckbox = ({
  services,
  selected,
  onChange
}: {
  services: AdditionalService[]
  selected: string[]
  onChange: (selected: string[]) => void
}) => {
  
  const handleServiceToggle = (serviceId: string) => {
    const newSelected = selected.includes(serviceId)
      ? selected.filter(id => id !== serviceId)
      : [...selected, serviceId]
    onChange(newSelected)
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Дополнительные услуги</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-lg border border-gray-200 p-4 hover:border-gray-300"
          >
            <Checkbox
              checked={selected.includes(service.id)}
              onChange={() => handleServiceToggle(service.id)}
              label={
                <div className="flex justify-between">
                  <span>{service.name}</span>
                  <span className="font-semibold">+{service.price} ₽</span>
                </div>
              }
              description={service.description}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export { Checkbox, AdditionalServicesCheckbox }